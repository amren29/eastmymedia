# Media Import Templates

These CSV templates help you bulk import media inventory into the admin panel.

## Files

| Template | Media Type | Key Fields |
|----------|------------|------------|
| `billboard_template.csv` | Static Billboard | GPS coordinates, dimensions |
| `led_screen_template.csv` | LED Screen | Operating time, loop info, ad duration |
| `roadside_bunting_template.csv` | Roadside Bunting | Start/End points (lamp posts) |
| `car_wrap_template.csv` | Car Wrap | District coverage |

## How to Use

1. **Open in Excel** - Double-click the CSV file or open Excel and import
2. **Edit the sample data** - Replace with your actual media information
3. **Delete sample rows** - Remove the example entries before importing
4. **Save as CSV** - Save the file (keep CSV format)
5. **Import in Admin Panel** - Go to Media → Click "Import" → Upload your CSV

## Field Descriptions

### Common Fields (All Types)
| Field | Description | Example |
|-------|-------------|---------|
| `skuId` | Unique identifier | FB001SBH |
| `name` | Media display name | KK Central Billboard |
| `location` | Physical location | Jalan Gaya Kota Kinabalu |
| `type` | Must match exactly | Static, LED Screen, Roadside Bunting, Car Wrap |
| `available` | Booking status | true or false |
| `totalPanel` | Number of panels | 1, 2, 5, etc. |
| `width` | Width dimension | 20 |
| `height` | Height dimension | 40 |
| `unit` | Measurement unit | ft, m, inch, pixel |
| `image` | Image URL | Leave empty if uploading later |
| `description` | Detailed description | Strategic location... |
| `landmark` | Nearby landmark | Centre Point Sabah |
| `targetMarket` | Target audience | Tourist, Shoppers, Business Community |
| `traffic` | Daily traffic | 50000 vehicles/day |

### Location Fields
| Field | Used By | Description |
|-------|---------|-------------|
| `gps` | Billboard, LED | Coordinates (lat, lng) | 5.979894, 116.074168 |
| `startPoint` | Roadside Bunting | First lamp post GPS |
| `endPoint` | Roadside Bunting | Last lamp post GPS |
| `district` | Car Wrap | Coverage area | Kota Kinabalu, Penampang |

### LED Screen Specific
| Field | Description | Example |
|-------|-------------|---------|
| `operatingTime` | Screen hours | 7:00 AM - 12:00 AM |
| `durationPerAd` | Ad slot duration | 15 Seconds |
| `noOfAdvertiser` | Slots per loop | 10 |
| `loopPerHr` | Loops per hour | 26 |
| `minLoopPerDay` | Daily minimum loops | 442 |
| `fileFormat` | Accepted formats | MP4 / MOV / JPEG |

### Pricing Fields
You can add up to 2 rental rates per row:
| Field | Description |
|-------|-------------|
| `duration1` | Duration option 1 | 1 Month, 3 Months, 6 Months, 12 Months |
| `rentalPrice1` | Rental price (RM) |
| `productionCost1` | Production/content cost (RM) |
| `rateType1` | Rate type | Standard, Offer, Agency, Referral |
| `duration2`, etc. | Second rate option |

## Tips

- **GPS Format**: Use decimal format: `5.979894, 116.074168`
- **Boolean Fields**: Use `true` or `false` (lowercase)
- **Commas in Text**: Wrap in quotes if text contains commas
- **Images**: Leave image blank, upload manually after import
- **Multiple Rates**: Add duration2/rentalPrice2/etc. columns for more rates
