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
      console.log(data)
      const data2 = await Promise.all(
        data.map(async (file) => { const data = supabase.storage
            .from("gallery")
            .getPublicUrl(file.name);
          if (error) {
            console.error(`Fayl uchun URL olishda xatolik: ${file.name}`);
            return null;
          }
          console.log(data)
          // return publicUrl;
        })
      );
    } catch (error) {
      console.error("Fayllarni olishda xatolik:", error.message);
    }
  };

  const getGallery = async () => {
    try {
      // Har bir fayl uchun getPublicUrl chaqiradi va barcha promises natijasini kutadi
      

      // Faqat muvaffaqiyatli URL larni qabul qiladi
      setGallery(files.filter((url) => url !== null));
    } catch (error) {
      console.error("Galereyani olishda xatolik:", error.message);
    }
  };

  useEffect(() => {
    getImages();
  }, []);



  return (
    <div>
      app
    </div>
  );
}

export default App;
