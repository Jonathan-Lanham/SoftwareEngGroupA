import os

def bundle_js_files(file_paths, output_path="test_build.js"):
    """
    Reads contents from multiple JavaScript files and bundles them into a single file.
    
    Args:
        file_paths (list): List of paths to JavaScript files
        output_path (str): Path to output the bundled JavaScript (default: test_build.js)
    """
    # Create a list to hold all js content
    combined_js = []
    
    # Process each file
    for file_path in file_paths:
        try:
            # Ensure the file exists
            if not os.path.exists(file_path):
                print(f"Warning: File not found: {file_path}")
                continue
                
            # Read the file's content
            with open(file_path, 'r', encoding='utf-8') as js_file:
                content = js_file.read()
                
            # Add a comment indicating the source file
            file_header = f"\n// Source: {os.path.basename(file_path)}\n"
            combined_js.append(file_header)
            combined_js.append(content)
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    combined_js.append('\nexport { DraggableObject, SpatialHashGrid, GateNode };')
    
    # Write the combined content to the output file
    try:
        with open(output_path, 'w', encoding='utf-8') as output_file:
            output_file.write("".join(combined_js))
        print(f"Successfully bundled {len(file_paths)} JavaScript files into {output_path}")
    except Exception as e:
        print(f"Error writing to output file: {e}")

# Example usage
if __name__ == "__main__":
    # List your JavaScript files here
    js_files = [
        "../main/assets/scripts/spatialHash.js",
        "../main/assets/scripts/NodeClass.js",
        "../main/assets/scripts/drawGates.js",
        "../main/assets/scripts/GameSounds.js",
        "../main/assets/scripts/GameObjects.js",
        "../main/assets/scripts/ConnectionObjects.js",
        "../main/assets/scripts/EndPointObjects.js",
        "../main/assets/scripts/DraggableObjects.js",
        "../main/assets/scripts/LogicGateObjects.js",
        "../main/assets/scripts/ComponentsObjects.js",
    ]
    
    # Call the function to bundle the files
    bundle_js_files(js_files, "test_build.js")