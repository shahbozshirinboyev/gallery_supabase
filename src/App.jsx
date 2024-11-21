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

        console.log(data)

      if (error) {
        throw error;
      }
      const imageUrls = await Promise.all(
        data.map(async (file) => {
          const { data: publicData, error } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.name);

          if (error) {
            console.error(error.message);
            return null;
          }
          return publicData.publicUrl;
        })
      );

      // Faqat muvaffaqiyatli URL larni saqlash
      setGallery(imageUrls.filter((url) => url !== null));
    } catch (error) {
      console.error(error.message);
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
        {gallery.map((url, index) => (
          <div
            key={index}
            className="relative group w-full h-[200px] border overflow-hidden"
          >
            {/* Tasvir */}
            <img
              src={url}
              alt={`Image ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-red-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
