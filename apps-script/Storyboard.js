
function buatStoryboard(input) {
  var apiKey = PropertiesService
      .getScriptProperties()
          .getProperty("GEMINI_API_KEY");

            if (!apiKey) {
                throw new Error("API Key Gemini belum ditemukan.");
                  }

                    var judul = input.judul || "Petualangan Bimo";
                      var tema = input.tema || "Petualangan belajar";
                        var karakter = input.karakter || "Bimo, Lala, Bubu";
                          var durasi = Number(input.durasi) || 4;
                            var bahasa = input.bahasa || "Bahasa Indonesia";
                              var tujuan = input.tujuan || "Belajar dan bekerja sama";

                                var prompt = `
                                Kamu adalah sutradara dan penulis serial animasi 3D anak profesional.

                                Buat storyboard animasi anak yang orisinal.

                                JUDUL: ${judul}
                                TEMA: ${tema}
                                KARAKTER: ${karakter}
                                DURASI: ${durasi} menit
                                BAHASA: ${bahasa}
                                TUJUAN EDUKASI: ${tujuan}

                                ATURAN:
                                - Cocok untuk anak usia 3 sampai 8 tahun.
                                - Cerita hangat, lucu, menarik, dan mudah dipahami.
                                - Memiliki pembukaan, masalah, usaha, solusi, dan penutup.
                                - Pertahankan identitas visual setiap karakter.
                                - Jangan meniru karakter atau cerita yang sudah ada.
                                - Buat tepat 7 adegan.
                                - Total durasi adegan mendekati ${durasi} menit.
                                - Dialog menggunakan ${bahasa}.

                                FORMAT HASIL:

                                JUDUL EPISODE:
                                TEMA:
                                RINGKASAN CERITA:
                                PESAN MORAL:

                                DESAIN KARAKTER:
                                Jelaskan wajah, rambut, pakaian, warna, bentuk tubuh, dan sifat setiap karakter. Desain harus konsisten di semua adegan.

                                STORYBOARD:

                                ADEGAN 1 — PEMBUKAAN
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 2 — MEMULAI PETUALANGAN
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 3 — MENEMUKAN MASALAH
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 4 — MENCOBA MENYELESAIKAN MASALAH
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 5 — TANTANGAN
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 6 — KERJA SAMA DAN SOLUSI
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                ADEGAN 7 — PENUTUP
                                Durasi:
                                Lokasi:
                                Suasana:
                                Karakter:
                                Visual:
                                Gerakan:
                                Ekspresi:
                                Dialog:
                                Kamera:

                                LAGU PENDEK:
                                Buat lirik lagu anak orisinal 4 sampai 8 baris sesuai tema.

                                PANDUAN ANIMASI:
                                Berikan petunjuk gerakan karakter dan perpindahan antaradegan agar mudah dibuat menjadi animasi 3D.

                                Pastikan semua 7 adegan lengkap.
                                Jangan menambahkan penjelasan di luar format.
                                `;

                                  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

                                    var response = UrlFetchApp.fetch(url, {
                                        method: "post",
                                            contentType: "application/json",
                                                headers: {
                                                      "x-goog-api-key": apiKey
                                                          },
                                                              payload: JSON.stringify({
                                                                    contents: [{
                                                                            parts: [{ text: prompt }]
                                                                                  }],
                                                                                        generationConfig: {
                                                                                                temperature: 0.8,
                                                                                                        maxOutputTokens: 7000
                                                                                                              }
                                                                                                                  }),
                                                                                                                      muteHttpExceptions: true
                                                                                                                        });

                                                                                                                          var status = response.getResponseCode();
                                                                                                                            var result = JSON.parse(response.getContentText());

                                                                                                                              if (status !== 200) {
                                                                                                                                  throw new Error(
                                                                                                                                        result.error ? result.error.message : "Gemini gagal membuat storyboard."
                                                                                                                                            );
                                                                                                                                              }

                                                                                                                                                if (!result.candidates || !result.candidates[0].content) {
                                                                                                                                                    throw new Error("Gemini tidak memberikan hasil storyboard.");
                                                                                                                                                      }

                                                                                                                                                        var teks = result.candidates[0].content.parts
                                                                                                                                                            .map(function(part) {
                                                                                                                                                                  return part.text || "";
                                                                                                                                                                      })
                                                                                                                                                                          .join("\n");

                                                                                                                                                                            if (!teks.trim()) {
                                                                                                                                                                                throw new Error("Hasil storyboard kosong.");
                                                                                                                                                                                  }

                                                                                                                                                                                    return teks;
                                                                                                                                                                                    }
                                                                                                                                                                                    