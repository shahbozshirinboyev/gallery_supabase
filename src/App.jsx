import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";

function App() {
  const [gallery, setGallery] = useState([]);

  const getImgData = async () => {
    const bucketName = "gallery";
    const bucketFolderName = "";

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(bucketFolderName, { limit: 100, offset: 0 });
      if (error) {
        throw error;
      }

      const imageUrls = await Promise.all(
        data.map(async (fileInfo) => {
          const { data: publicData, error } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileInfo.name);

          if (error) {
            console.error(
              `Error fetching public URL for ${fileInfo.name}:`,
              error.message
            );
            return null;
          }
          return {
            ...fileInfo,
            publicUrl: publicData.publicUrl,
          };
        })
      );

      setGallery(imageUrls.filter((item) => item !== null));
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  useEffect(() => {
    getImgData();
  }, []);

  return (
    <div className="container">
      <h1 className="container text-center text-[45px] font-bold text-sky-500">
        Gallery
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {gallery.map((image, index) => (
          <div
            key={index}
            className="relative group w-full overflow-hidden p-2 border rounded-md"
          >
            {/* Tasvir */}
            <img
              src={image.publicUrl}
              alt={`Image ${index}`}
              className="w-full h-[200px] object-cover rounded-md"
            />
            <div className="pt-2">
              <span>Name: </span> <span>{image.name}</span>
              <br />
              <span>Size: </span>{" "}
              <span>{Math.round(image.metadata.size / 1024).toFixed(1)}</span>{" "}
              <span>Kb</span>
            </div>
            <div className="absolute inset-0 bg-red-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
