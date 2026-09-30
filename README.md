# MedScanner-Lab-Aggregator

## Project Overview
MedScanner Lab Aggregator is a full-stack web application designed to help users search for medical lab tests, compare prices from available diagnostic providers, and find the best deals near their location. Built strictly following the assignment requirements, it connects a modern, responsive React frontend with an Express/Node.js backend, correctly processing and ranking test packages by their true final price.

## Features
- **Pincode Filtering**: Automatically excludes diagnostic providers that do not service the user's specific pincode.
- **Package Matching**: intelligently surfaces Health Packages if they contain the searched standalone test inside their `included_tests` array.
- **True Price Sorting**: Accurately ranks all results by calculating the lowest `Total Final Price` (Offer Price + Home Collection Fee).
- **Modern UI**: A responsive, clean, and accessible UI optimized for both desktop and mobile.
- **NABL Badges**: Visually highlights NABL-certified labs to build trust.
- **Best Price Indicator**: Automatically highlights the absolute cheapest option for the user.
- **Case-Insensitive Search**: Allows for messy, whitespace-heavy, or mis-capitalized inputs (e.g., `  LIPID PROFILE ` matches `Lipid Profile`).

## Tech Stack
- **Frontend**: React, standard HTML/CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: Mock JSON Data structure

## Project Structure
```text
MedScanner-Lab-Aggregator/
├── Backend/
│   ├── controller/searchController.js
│   ├── routes/search.js
│   ├── service/searchService.js
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── package.json (root orchestration)
```

## Local Setup & Run Instructions

To run the application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd MedScanner-Lab-Aggregator
   ```

2. **Install all dependencies (Root, Frontend, Backend):**
   ```bash
   npm install
   ```

3. **Start both Frontend and Backend servers simultaneously:**
   ```bash
   npm run dev
   ```

   - The Frontend will be available at `http://localhost:5173/`
   - The Backend API will be running at `http://localhost:8010/api`

## API Details

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `search_query` (string) - The name of the test to search for.
- `pincode` (string) - The 6-digit pincode.

**Example Request:**
```
GET /api/search?search_query=Lipid%20Profile&pincode=110001
```

## Core Business Logic

### Pincode Filtering Logic
The system parses the provider's `available_pincodes` array. If the user's 6-digit input does not exactly match an entry in this array, the provider is excluded from the results.

### Package Matching Logic
Search matching is completely case-insensitive and ignores trailing/leading whitespaces. The backend checks if the cleaned `search_query` strictly matches *either* a standalone test name *or* an item within a package's `included_tests` array. 

### True Final Price Formula
The final price dictating the sort order is calculated accurately for every provider:
`Total Final Price = offer_price + home_collection_fee`

### Example Result & Order
For `search_query=Lipid Profile` and `pincode=110001`, the backend accurately filters and sorts the mock data:
1. Local City Lab (₹450 + ₹0) = **₹450**
2. Apollo Diagnostics (₹800 + ₹100) = **₹900**
3. Lal PathLabs (₹1500 + ₹150) = **₹1650**
4. Tata 1mg (₹1999 + ₹0) = **₹1999**

### Edge Cases Handled
- **Missing or unsupported pincodes:** Returns an empty array, prompting a clean UI empty state.
- **Malformed search queries:** Trims whitespace and lowercases input on both the query side and the database item side to prevent strict match failures.
- **Mathematical Precedence:** The sorting logic compares complete total prices using (offer_price + home_collection_fee).

## Step 4: The Thinking Question

**Question:** *In the real world, big companies will try to block our servers from scraping their prices. If you had to build a scraper to get live prices from a competitor's website without getting blocked, how would you architect it?*

**Answer:**
I would first check for an official API or permitted data source before using scraping. For live price collection, I would use a scheduler and job queue with controlled request rates, caching, and retries so the target site is not hit unnecessarily. Separate workers could collect data from different sources while respecting each site's robots rules, terms, and rate limits. The extracted prices would be normalized and stored with timestamps so the aggregator can serve recent data without scraping on every user request. Monitoring and failure handling would be added to detect blocked requests or source changes and keep the pipeline reliable.
