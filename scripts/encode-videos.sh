#!/bin/bash

# Check if input file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input_video_file>"
    exit 1
fi

INPUT_FILE=$1
FILENAME=$(basename "$INPUT_FILE" | cut -d. -f1)
OUTPUT_DIR="../assets/videos"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate HLS playlist and segments
ffmpeg -i "$INPUT_FILE" \
    -c:v h264 -preset fast \
    -map 0:v:0 -map 0:a:0 \
    -b:v:0 2000k -c:a:0 aac -b:a:0 128k \
    -var_stream_map "v:0,a:0" \
    -master_pl_name "${FILENAME}_master.m3u8" \
    -f hls \
    -hls_time 6 \
    -hls_list_size 0 \
    -hls_segment_filename "${OUTPUT_DIR}/${FILENAME}_%v_%03d.ts" \
    "${OUTPUT_DIR}/${FILENAME}_%v.m3u8"

# Generate thumbnail
ffmpeg -i "$INPUT_FILE" -ss 00:00:01.000 -vframes 1 "${OUTPUT_DIR}/${FILENAME}_thumb.jpg"

echo "Video encoding completed. Files saved in $OUTPUT_DIR"
