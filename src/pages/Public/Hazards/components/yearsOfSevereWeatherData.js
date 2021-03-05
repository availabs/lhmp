export const EARLIEST_YEAR = 1996;
export const LATEST_YEAR = 2020;

const YEARS_OF_SEVERE_WEATHER_DATA = [];
for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
    YEARS_OF_SEVERE_WEATHER_DATA.push(year);
}
export { YEARS_OF_SEVERE_WEATHER_DATA };