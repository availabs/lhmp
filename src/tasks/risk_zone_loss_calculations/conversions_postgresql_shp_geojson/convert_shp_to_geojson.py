import os
import glob

def convert_shp_to_geojson():
    for root, dirs, files in os.walk('dfirm_NY_data'):
        for file in files:
            if 'shp' in file:
                shp_file = root + '/' + file
                geojson = 'geojson/'+file[:-4]+'.geojson'
                cmd = "ogr2ogr -f GeoJSON " +" "+geojson+" "+ shp_file
                print(cmd)
                os.system(cmd)

def convert_geojson_mbtiles():
    cmd = "tippecanoe -zg --generate-ids -o mbtiles/ny_counties_dfirm.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping"
    for geojson in glob.glob("geojson/*.geojson"):
        cmd += " "+geojson+" "

    os.system(cmd)

def main():
    #convert_shp_to_geojson()
    convert_geojson_mbtiles()
# END main

if __name__ == "__main__":
    main()
