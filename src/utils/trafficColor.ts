/**
 * Returns a color string based on the traffic value (0-1).
 * 
 * 0.80 - 1.00 = #FF0000 (Red) - Heavy Traffic
 * 0.60 - 0.79 = #FF8C00 (Orange) - Moderate Traffic
 * 0.40 - 0.59 = #FFFF00 (Yellow) - Light Traffic
 * Below 0.40 = #32CD32 (Green) - Clear Traffic
 */
export function getTrafficColor(value: number): string {
    if (value >= 0.8) {
        return '#FF0000'; // Red
    } else if (value >= 0.6) {
        return '#FF8C00'; // Orange
    } else if (value >= 0.4) {
        return '#FFFF00'; // Yellow
    } else {
        return '#32CD32'; // Green
    }
}
