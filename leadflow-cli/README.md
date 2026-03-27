# LeadFlow CLI v2
AI Client Acquisition System

## Install (super simple)
Step 1: Install Node.js  
Step 2: Download and unzip this folder  
Step 3: Open this folder  
Step 4: Open terminal in this folder  
Step 5: Run: `npm install`  
Step 6: Run: `npm link`  

Now you can type `leadflow` from terminal.

## How to use
Example:
```bash
leadflow generate --niche "dentists" --location "Cape Town"
```

## Copy-paste commands
```bash
leadflow generate --niche "dentists" --location "Cape Town" --service "website redesign" --count 20 --mode deep --output leads.csv
```

```bash
leadflow generate --niche "law firms" --location "Austin" --service "seo" --count 30 --mode aggressive --output law-firms.csv
```

```bash
leadflow generate --niche "roofers" --location "Miami" --service "google ads" --count 15 --mode quick --output roofers.json
```

## Inputs (plain English)
- niche = type of business  
- location = where businesses are  
- service = what you offer  
- count = how many leads you want  
- mode = quick, deep, or aggressive

## Output (what you get)
- lead score (0 to 100)
- detected business problems
- suggested service offer
- outreach email
- follow-up email
- CSV or JSON file you can send to clients

## Sample output
See:
- `examples/sample-output.csv`
- `examples/sample-output.json`

## Build a Windows .exe (no coding needed)
1. In terminal, run:
```bash
npm install
npm run build:win
```
2. Open the `dist` folder.
3. You will see `leadflow-cli-v2.exe` (or similar).

## Run the .exe
Open terminal in the `dist` folder and run:
```bash
leadflow-cli-v2.exe generate --niche "dentists" --location "Cape Town" --service "website redesign" --count 10 --mode deep --output leads.csv
```

## Build all standalone apps (Windows, Mac, Linux)
```bash
npm run build:exe
```

## Help and version
```bash
leadflow --help
leadflow --version
```
