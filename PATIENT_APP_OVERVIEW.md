# 🏥 MedFind Salone — Patient App Page Overview

This page is the Patient App interface of MedFind Salone — designed to help users find emergency medical care and hospital information quickly.

It is part of a web application built for emergency and routine hospital search in Sierra Leone.

## 📱 Header & Navigation

At the top, the page typically shows the app branding or logo (if integrated).

Navigation elements (either visible or built into the SPA) allow the user to switch between:

*   Home / Dashboard
*   Emergency Search
*   Favorites / Filters
*   Admin Panel (if permitted)

## 🔍 Search & Filters

The main interface allows users to input or select hospital search criteria:

### Service Filters

Users can filter hospitals based on:

*   Emergency
*   Maternity
*   Surgery
*   Pediatrics
*   ICU / Critical Care
*   Others (as available)

Each button or card should filter the hospital dataset accordingly.

## 📍 Location & Availability

The page detects the user’s location using browser geolocation (if permitted).

The interface indicates a section “Nearby Hospitals” with distance and relevance.

Visual cues assist users to understand relative proximity to medical facilities.

## 📊 Hospital Listings

For each hospital listed, the interface aims to show:

*   Name
*   Distance from user
*   Contact number
*   Beds availability
*   Oxygen availability
*   Surgeon availability
*   Ambulance status
*   Service types offered

These visual indicators help users decide which hospital is best suited for their urgent need.

## 🧭 Live Map Preview

A map section is included (often near the top or below filters).

It displays nearby hospital markers using GPS/geolocation.

Map pins may show color codes indicating handling capacity (e.g., green = available, red = full).

## 🚨 Emergency Features

This page includes key emergency functions:

*   SOS / “FIND HELP NOW” button
*   Initiates a fast search for the nearest hospital
*   Launches routing/navigation (if permitted)
*   May trigger direct calls to emergency contacts

## 📃 Hospital Detail Interaction

Clicking on a hospital listing opens a detailed view that should include:

*   Full hospital profile
*   Availability stats (beds, oxygen, specialists)
*   Contact buttons (call, directions)
*   Additional remarks or notes

## 💾 Offline Functionality (Design Goal)

Although not fully implemented yet, the page is designed to support:

*   Local data caching
*   Offline access to hospital database
*   Automatic synchronization when back online

## 📐 Design & Responsiveness

Built with a mobile-first philosophy

Should adapt to:

*   Small screens (phones)
*   Medium screens (tablets)
*   Large screens (desktops)

Buttons, fonts, and touch targets are sized for accessibility

## 🧠 User Experience Principles

This page is intended to be:

*   **Fast** — loads quickly even on slow connections
*   **Intuitive** — minimal text, big buttons
*   **Actionable** — immediate emergency routing
*   **Locally relevant** — tailored to Sierra Leone’s healthcare challenges

## 🧩 What Works Now (As of Current Deployment)

*   ✔ The layout structure is present
*   ✔ Filters and service categories are visible
*   ✔ Map section is present
*   ✔ Emergency call and routing placeholders exist
*   ✔ UI elements have places for dynamic data

## 📌 What Needs Implementation (Future Work)

*   ⚠ Actual hospital data must load into the list
*   ⚠ Filters must dynamically update results
*   ⚠ Offline caching must be enabled
*   ⚠ Map pins must link to proper coordinates
*   ⚠ Dynamic availability (beds/oxygen) must display
*   ⚠ Responsive adjustments for all screen sizes

## 🏁 Summary (Judge-Ready)

The `/app.html` page is the Patient Interface of MedFind Salone. It provides a service-focused, mobile-friendly dashboard for locating hospitals in Sierra Leone. It includes navigation, emergency search, filters for service types (Emergency, Maternity, Surgery, Pediatrics, ICU), a live map preview, and hospital detail interactions.
Design is structured for quick decision-making and emergency response.
