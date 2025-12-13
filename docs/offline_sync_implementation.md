# MedFind Salone - Offline-First Synchronization Implementation

## Overview

This document provides production-ready code samples and implementation strategies for building the offline-first synchronization system for MedFind Salone.

---

## 1. Local Database Setup

### Using WatermelonDB (React Native - Recommended)

**Installation:**
```bash
npm install @nozbe/watermelondb
npm install @nozbe/with-observables
```

**Schema Definition:**
```javascript
// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'hospitals',
      columns: [
        { name: 'hospital_id', type: 'string', isIndexed: true },
        { name: 'hospital_name', type: 'string' },
        { name: 'district', type: 'string', isIndexed: true },
        { name: 'region', type: 'string', isIndexed: true },
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
        { name: 'phone', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'website', type: 'string', isOptional: true },
        { name: 'facility_type', type: 'string' },
        { name: 'static_bed_capacity', type: 'string' }, // JSON string
        { name: 'average_occupancy_rates', type: 'string' }, // JSON string
        { name: 'key_services', type: 'string' }, // JSON string
        { name: 'specialists_available', type: 'string' }, // JSON string
        { name: 'emergency_numbers', type: 'string' }, // JSON string array
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'dynamic_availability',
      columns: [
        { name: 'hospital_id', type: 'string', isIndexed: true },
        { name: 'beds_available_now', type: 'number' },
        { name: 'oxygen_available', type: 'string' },
        { name: 'surgeons_on_duty', type: 'string' },
        { name: 'operating_theatre_status', type: 'string' },
        { name: 'ambulance_available', type: 'string' },
        { name: 'last_updated_timestamp', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'sync_metadata',
      columns: [
        { name: 'key', type: 'string', isIndexed: true },
        { name: 'value', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'pending_updates',
      columns: [
        { name: 'hospital_id', type: 'string' },
        { name: 'update_type', type: 'string' },
        { name: 'payload', type: 'string' }, // JSON string
        { name: 'retry_count', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
  ]
})
```

**Model Classes:**
```javascript
// model/Hospital.js
import { Model } from '@nozbe/watermelondb'
import { field, json } from '@nozbe/watermelondb/decorators'

export default class Hospital extends Model {
  static table = 'hospitals'

  @field('hospital_id') hospitalId
  @field('hospital_name') hospitalName
  @field('district') district
  @field('region') region
  @field('latitude') latitude
  @field('longitude') longitude
  @field('phone') phone
  @field('email') email
  @field('website') website
  @field('facility_type') facilityType
  
  @json('static_bed_capacity', json => json) staticBedCapacity
  @json('average_occupancy_rates', json => json) averageOccupancyRates
  @json('key_services', json => json) keyServices
  @json('specialists_available', json => json) specialistsAvailable
  @json('emergency_numbers', json => json) emergencyNumbers
  
  @field('notes') notes
  @field('created_at') createdAt
  @field('updated_at') updatedAt

  // Computed property for distance calculation
  distanceFrom(userLat, userLon) {
    return calculateDistance(
      userLat, userLon,
      this.latitude, this.longitude
    )
  }
}

// model/DynamicAvailability.js
import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export default class DynamicAvailability extends Model {
  static table = 'dynamic_availability'

  @field('hospital_id') hospitalId
  @field('beds_available_now') bedsAvailableNow
  @field('oxygen_available') oxygenAvailable
  @field('surgeons_on_duty') surgeonsOnDuty
  @field('operating_theatre_status') operatingTheatreStatus
  @field('ambulance_available') ambulanceAvailable
  @field('last_updated_timestamp') lastUpdatedTimestamp
  @field('updated_at') updatedAt
}
```

---

## 2. Initial Data Seeding

```javascript
// utils/seedDatabase.js
import database from './database'
import hospitalsData from '../data/hospitals_complete.json'

export async function seedInitialData() {
  await database.write(async () => {
    const hospitalsCollection = database.collections.get('hospitals')
    const availabilityCollection = database.collections.get('dynamic_availability')

    for (const hospital of hospitalsData) {
      // Create hospital record
      await hospitalsCollection.create(record => {
        record.hospital_id = hospital.id
        record.hospitalName = hospital.hospital_name
        record.district = hospital.district
        record.region = hospital.region
        record.latitude = hospital.latitude
        record.longitude = hospital.longitude
        record.phone = hospital.phone
        record.email = hospital.email
        record.website = hospital.website
        record.facilityType = hospital.facility_type
        record.staticBedCapacity = hospital.static_bed_capacity
        record.averageOccupancyRates = hospital.average_occupancy_rates
        record.keyServices = hospital.key_services
        record.specialistsAvailable = hospital.specialists_available
        record.emergencyNumbers = hospital.emergency_numbers
        record.notes = hospital.notes
        record.createdAt = Date.now()
        record.updatedAt = Date.now()
      })

      // Create dynamic availability record
      await availabilityCollection.create(record => {
        record.hospitalId = hospital.id
        record.bedsAvailableNow = hospital.dynamic_availability.beds_available_now
        record.oxygenAvailable = hospital.dynamic_availability.oxygen_available
        record.surgeonsOnDuty = hospital.dynamic_availability.surgeons_on_duty
        record.operatingTheatreStatus = hospital.dynamic_availability.operating_theatre_status
        record.ambulanceAvailable = hospital.dynamic_availability.ambulance_available
        record.lastUpdatedTimestamp = new Date(hospital.dynamic_availability.last_updated_timestamp).getTime()
        record.updatedAt = Date.now()
      })
    }

    // Set initial sync timestamp
    const syncMetadata = database.collections.get('sync_metadata')
    await syncMetadata.create(record => {
      record.key = 'last_sync_timestamp'
      record.value = new Date().toISOString()
      record.updatedAt = Date.now()
    })
  })

  console.log('✅ Database seeded with', hospitalsData.length, 'hospitals')
}
```

---

## 3. Differential Sync Implementation

```javascript
// services/syncService.js
import NetInfo from '@react-native-community/netinfo'
import database from '../utils/database'

class SyncService {
  constructor() {
    this.isSyncing = false
    this.syncInterval = 30 * 60 * 1000 // 30 minutes
    this.syncTimer = null
  }

  // Initialize sync service
  async initialize() {
    // Check network status
    this.netInfo = NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        this.performSync()
      }
    })

    // Start periodic sync
    this.startPeriodicSync()

    // Perform initial sync if online
    const netState = await NetInfo.fetch()
    if (netState.isConnected) {
      this.performSync()
    }
  }

  // Start periodic background sync
  startPeriodicSync() {
    this.syncTimer = setInterval(() => {
      this.checkAndSync()
    }, this.syncInterval)
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }
  }

  // Check network and perform sync
  async checkAndSync() {
    const netState = await NetInfo.fetch()
    if (netState.isConnected && !this.isSyncing) {
      await this.performSync()
    }
  }

  // Main sync function
  async performSync() {
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress')
      return
    }

    this.isSyncing = true
    console.log('🔄 Starting sync...')

    try {
      // 1. Get last sync timestamp
      const lastSync = await this.getLastSyncTimestamp()
      console.log('📅 Last sync:', lastSync)

      // 2. Fetch updates from server
      const response = await fetch(
        `https://api.medfindsalone.sl/v1/sync?last_sync=${lastSync}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`)
      }

      const syncData = await response.json()

      // 3. Apply updates to local database
      await this.applyUpdates(syncData.updates)

      // 4. Update last sync timestamp
      await this.updateLastSyncTimestamp(syncData.sync_timestamp)

      // 5. Upload pending updates
      await this.uploadPendingUpdates()

      console.log('✅ Sync completed successfully')
    } catch (error) {
      console.error('❌ Sync error:', error)
    } finally {
      this.isSyncing = false
    }
  }

  // Get last sync timestamp from local database
  async getLastSyncTimestamp() {
    const syncMetadata = database.collections.get('sync_metadata')
    const lastSyncRecord = await syncMetadata.query(
      Q.where('key', 'last_sync_timestamp')
    ).fetch()

    if (lastSyncRecord.length > 0) {
      return lastSyncRecord[0].value
    }

    // Default to 7 days ago if no sync record
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() - 7)
    return defaultDate.toISOString()
  }

  // Apply server updates to local database
  async applyUpdates(updates) {
    await database.write(async () => {
      const availabilityCollection = database.collections.get('dynamic_availability')

      // Update hospitals
      for (const hospitalUpdate of updates.hospitals_updated || []) {
        const existing = await availabilityCollection.query(
          Q.where('hospital_id', hospitalUpdate.id)
        ).fetch()

        if (existing.length > 0) {
          // Update existing record
          await existing[0].update(record => {
            const avail = hospitalUpdate.dynamic_availability
            record.bedsAvailableNow = avail.beds_available_now
            record.oxygenAvailable = avail.oxygen_available
            record.surgeonsOnDuty = avail.surgeons_on_duty
            record.operatingTheatreStatus = avail.operating_theatre_status
            record.ambulanceAvailable = avail.ambulance_available
            record.lastUpdatedTimestamp = new Date(avail.last_updated_timestamp).getTime()
            record.updatedAt = Date.now()
          })
        }
      }

      console.log(`📊 Updated ${updates.hospitals_updated?.length || 0} hospitals`)
    })
  }

  // Update last sync timestamp
  async updateLastSyncTimestamp(timestamp) {
    await database.write(async () => {
      const syncMetadata = database.collections.get('sync_metadata')
      const records = await syncMetadata.query(
        Q.where('key', 'last_sync_timestamp')
      ).fetch()

      if (records.length > 0) {
        await records[0].update(record => {
          record.value = timestamp
          record.updatedAt = Date.now()
        })
      } else {
        await syncMetadata.create(record => {
          record.key = 'last_sync_timestamp'
          record.value = timestamp
          record.updatedAt = Date.now()
        })
      }
    })
  }

  // Upload pending updates to server
  async uploadPendingUpdates() {
    const pendingCollection = database.collections.get('pending_updates')
    const pendingUpdates = await pendingCollection.query().fetch()

    if (pendingUpdates.length === 0) {
      console.log('✅ No pending updates to upload')
      return
    }

    console.log(`📤 Uploading ${pendingUpdates.length} pending updates...`)

    for (const update of pendingUpdates) {
      try {
        const payload = JSON.parse(update.payload)
        
        const response = await fetch(
          'https://api.medfindsalone.sl/v1/update_availability',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await this.getAuthToken()}`,
            },
            body: JSON.stringify(payload),
          }
        )

        if (response.ok) {
          // Delete successful update
          await database.write(async () => {
            await update.markAsDeleted()
          })
          console.log(`✅ Uploaded update for hospital ${payload.hospital_id}`)
        } else {
          // Increment retry count
          await database.write(async () => {
            await update.update(record => {
              record.retryCount = update.retryCount + 1
            })
          })
          console.warn(`⚠️ Failed to upload update (retry ${update.retryCount})`)
        }
      } catch (error) {
        console.error('❌ Upload error:', error)
      }
    }
  }

  // Queue update for later upload (when offline)
  async queueUpdate(hospitalId, updateData) {
    await database.write(async () => {
      const pendingCollection = database.collections.get('pending_updates')
      
      await pendingCollection.create(record => {
        record.hospitalId = hospitalId
        record.updateType = 'availability_update'
        record.payload = JSON.stringify({
          hospital_id: hospitalId,
          dynamic_availability: updateData,
        })
        record.retryCount = 0
        record.createdAt = Date.now()
      })
    })

    console.log('📝 Update queued for later sync')
  }

  // Get auth token from secure storage
  async getAuthToken() {
    // Implement based on your auth system
    // Example: return await AsyncStorage.getItem('auth_token')
    return 'your_auth_token_here'
  }
}

export default new SyncService()
```

---

## 4. Distance Calculation Utility

```javascript
// utils/geoUtils.js

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Estimate travel time based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated time in minutes
 */
export function estimateTravelTime(distanceKm) {
  const avgSpeedKmh = 30 // Average speed in urban areas
  const timeHours = distanceKm / avgSpeedKmh
  const timeMinutes = Math.ceil(timeHours * 60)
  return timeMinutes
}

/**
 * Sort hospitals by distance from user location
 * @param {Array} hospitals - Array of hospital objects
 * @param {number} userLat - User latitude
 * @param {number} userLon - User longitude
 * @returns {Array} Sorted array with distance property added
 */
export function sortByDistance(hospitals, userLat, userLon) {
  return hospitals
    .map(hospital => ({
      ...hospital,
      distance: calculateDistance(userLat, userLon, hospital.latitude, hospital.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
}
```

---

## 5. Query Examples

```javascript
// services/hospitalService.js
import database from '../utils/database'
import { Q } from '@nozbe/watermelondb'
import { sortByDistance } from '../utils/geoUtils'

class HospitalService {
  
  // Get all hospitals
  async getAllHospitals() {
    const hospitalsCollection = database.collections.get('hospitals')
    return await hospitalsCollection.query().fetch()
  }

  // Search by district
  async searchByDistrict(district) {
    const hospitalsCollection = database.collections.get('hospitals')
    return await hospitalsCollection.query(
      Q.where('district', district)
    ).fetch()
  }

  // Search by service
  async searchByService(service, userLat, userLon) {
    const hospitals = await this.getAllHospitals()
    
    // Filter hospitals that have the service
    const filtered = hospitals.filter(hospital => {
      const services = hospital.keyServices
      return services[service] === true
    })

    // Sort by distance if location provided
    if (userLat && userLon) {
      return sortByDistance(filtered, userLat, userLon)
    }

    return filtered
  }

  // Find nearest hospital with emergency services
  async findNearestEmergency(userLat, userLon) {
    const hospitals = await this.searchByService('emergency', userLat, userLon)
    return hospitals[0] // First is nearest
  }

  // Search with availability filters
  async searchWithFilters(filters, userLat, userLon) {
    const hospitals = await this.getAllHospitals()
    const availabilityCollection = database.collections.get('dynamic_availability')

    // Get all availability data
    const allAvailability = await availabilityCollection.query().fetch()
    const availabilityMap = {}
    allAvailability.forEach(avail => {
      availabilityMap[avail.hospitalId] = avail
    })

    // Filter hospitals
    let filtered = hospitals.filter(hospital => {
      const avail = availabilityMap[hospital.hospital_id]
      
      // Service filter
      if (filters.service && !hospital.keyServices[filters.service]) {
        return false
      }

      // Availability filters
      if (filters.bedsAvailable && (!avail || avail.bedsAvailableNow <= 0)) {
        return false
      }

      if (filters.oxygenAvailable && (!avail || avail.oxygenAvailable !== 'Yes')) {
        return false
      }

      if (filters.surgeonsOnDuty && (!avail || avail.surgeonsOnDuty === 'No')) {
        return false
      }

      if (filters.operatingTheatre && (!avail || avail.operatingTheatreStatus !== 'Functional')) {
        return false
      }

      if (filters.ambulanceAvailable && (!avail || avail.ambulanceAvailable !== 'Yes')) {
        return false
      }

      // Facility type filter
      if (filters.facilityType && hospital.facilityType !== filters.facilityType) {
        return false
      }

      return true
    })

    // Sort by distance if location provided
    if (userLat && userLon) {
      filtered = sortByDistance(filtered, userLat, userLon)
    }

    // Add availability data to results
    return filtered.map(hospital => ({
      ...hospital,
      availability: availabilityMap[hospital.hospital_id],
    }))
  }

  // Get hospital by ID with availability
  async getHospitalById(hospitalId) {
    const hospitalsCollection = database.collections.get('hospitals')
    const availabilityCollection = database.collections.get('dynamic_availability')

    const hospital = await hospitalsCollection.find(hospitalId)
    const availability = await availabilityCollection.query(
      Q.where('hospital_id', hospitalId)
    ).fetch()

    return {
      ...hospital,
      availability: availability[0] || null,
    }
  }
}

export default new HospitalService()
```

---

## 6. React Native Component Example

```javascript
// screens/EmergencyScreen.js
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import HospitalService from '../services/hospitalService'

export default function EmergencyScreen() {
  const [nearestHospital, setNearestHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    findNearestHospital()
  }, [])

  const findNearestHospital = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords
        
        const hospital = await HospitalService.findNearestEmergency(
          latitude,
          longitude
        )

        setNearestHospital(hospital)
        setLoading(false)
      },
      error => {
        Alert.alert('Location Error', 'Unable to get your location')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }

  const callEmergency = () => {
    if (nearestHospital && nearestHospital.emergency_numbers?.length > 0) {
      const phoneNumber = nearestHospital.emergency_numbers[0]
      Linking.openURL(`tel:${phoneNumber}`)
    }
  }

  const getDirections = () => {
    if (nearestHospital) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.latitude},${nearestHospital.longitude}`
      Linking.openURL(url)
    }
  }

  if (loading) {
    return <View><Text>Finding nearest hospital...</Text></View>
  }

  if (!nearestHospital) {
    return <View><Text>No hospitals found</Text></View>
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#DC2626', padding: 20 }}>
      <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold', marginBottom: 20 }}>
        EMERGENCY
      </Text>
      
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 10 }}>
        {nearestHospital.hospital_name}
      </Text>
      
      <Text style={{ fontSize: 18, color: 'white', marginBottom: 30 }}>
        {nearestHospital.distance} km away
      </Text>

      <TouchableOpacity
        onPress={callEmergency}
        style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 15 }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          CALL NOW
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={getDirections}
        style={{ backgroundColor: '#FCD34D', padding: 20, borderRadius: 10 }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          GET DIRECTIONS
        </Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

## 7. Admin Update Implementation

```javascript
// screens/AdminUpdateScreen.js
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react'
import NetInfo from '@react-native-community/netinfo'
import SyncService from '../services/syncService'

export default function AdminUpdateScreen({ hospitalId }) {
  const [bedsAvailable, setBedsAvailable] = useState('')
  const [oxygenAvailable, setOxygenAvailable] = useState('Yes')
  const [surgeonsOnDuty, setSurgeonsOnDuty] = useState('Yes')
  const [operatingTheatre, setOperatingTheatre] = useState('Functional')
  const [ambulanceAvailable, setAmbulanceAvailable] = useState('Yes')

  const handleQuickUpdate = async (field, value) => {
    const updateData = { [field]: value }
    
    const netState = await NetInfo.fetch()
    
    if (netState.isConnected) {
      // Upload immediately
      try {
        const response = await fetch(
          'https://api.medfindsalone.sl/v1/quick_update',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              hospital_id: hospitalId,
              field,
              value,
            }),
          }
        )

        if (response.ok) {
          Alert.alert('Success', 'Update saved')
        }
      } catch (error) {
        // Queue for later
        await SyncService.queueUpdate(hospitalId, updateData)
        Alert.alert('Offline', 'Update queued for sync')
      }
    } else {
      // Queue for later
      await SyncService.queueUpdate(hospitalId, updateData)
      Alert.alert('Offline', 'Update queued for sync')
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Quick Updates
      </Text>

      {/* Quick action buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => handleQuickUpdate('oxygen_available', 'No')}
          style={{ flex: 1, backgroundColor: '#EF4444', padding: 15, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            NO OXYGEN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleQuickUpdate('oxygen_available', 'Yes')}
          style={{ flex: 1, backgroundColor: '#10B981', padding: 15, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            OXYGEN OK
          </Text>
        </TouchableOpacity>
      </View>

      {/* More quick action buttons... */}
    </View>
  )
}
```

---

## 8. Performance Optimization

### Indexing Strategy
```javascript
// Add indexes to frequently queried fields
CREATE INDEX idx_hospitals_district ON hospitals(district);
CREATE INDEX idx_hospitals_region ON hospitals(region);
CREATE INDEX idx_hospitals_facility_type ON hospitals(facility_type);
CREATE INDEX idx_dynamic_hospital_id ON dynamic_availability(hospital_id);
```

### Caching Strategy
```javascript
// Cache frequently accessed data
class CacheService {
  constructor() {
    this.cache = new Map()
    this.cacheDuration = 5 * 60 * 1000 // 5 minutes
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.cacheDuration) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }
}
```

---

## Testing Checklist

- [ ] App works completely offline after initial setup
- [ ] Data syncs automatically when online
- [ ] Pending updates queue and upload when connection restored
- [ ] Distance calculations are accurate
- [ ] Search performance is fast (< 100ms for typical queries)
- [ ] Memory usage is acceptable (< 100MB)
- [ ] Database size remains manageable (< 10MB)
- [ ] Sync completes in < 5 seconds with good connection

---

*Implementation Guide Version: 1.0*  
*Last Updated: 2025-12-13*
