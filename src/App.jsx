import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";

function App() {
  const [allFileNames, setAllFileNames] = useState([]);
  const [gallery, setGallery] = useState([]);

  const getImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("gallery")
        .list("", { limit: 100, offset: 0 });
      if (error) {
        throw error;
      }
      setAllFileNames(data);
    } catch (error) {
      console.error("Fayllarni olishda xatolik:", error.message);
    }
  };

  const getGallery = async () => {
    try {
      // Har bir fayl uchun getPublicUrl chaqiradi va barcha promises natijasini kutadi
      const files = await Promise.all(
        allFileNames.map(async (file) => {
          const { publicUrl, error } = supabase.storage
            .from("gallery")
            .getPublicUrl(file.name);
          if (error) {
            console.error(`Fayl uchun URL olishda xatolik: ${file.name}`);
            return null;
          }
          return publicUrl;
        })
      );

      // Faqat muvaffaqiyatli URL larni qabul qiladi
      setGallery(files.filter((url) => url !== null));
    } catch (error) {
      console.error("Galereyani olishda xatolik:", error.message);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    if (allFileNames.length > 0) {
      getGallery();
    }
  }, [allFileNames]);

  useEffect(() => {
    console.log("Gallery URLs:", gallery);
  }, [gallery]);

  return (
    <div>
      <h1>Gallery Files</h1>
      <ul>
        {allFileNames.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <h2>Gallery Images</h2>
      <div>
        {gallery.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index}`} width={200} />
        ))}
      </div>
    </div>
  );
}

export default App;
