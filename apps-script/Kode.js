const GEMINI_MODEL = "gemini-3.1-flash-lite";

function doGet() {
  return ContentService
      .createTextOutput(JSON.stringify({
            status: "online",
                  app: "Kids Animation AI Backend"
                      }))
                          .setMimeType(ContentService.MimeType.JSON);
                          }

                          function buatCerita(input) {
                            const apiKey = PropertiesService
                                .getScriptProperties()
                                    .getProperty("GEMINI_API_KEY");

                                      if (!apiKey) {
                                          throw new Error("API Key Gemini belum ditemukan.");
                                            }

                                              const tema = input.tema || "Petualangan belajar bersama teman";
                                                const judul = input.judul || "Petualangan Bimo";
                                                  const karakter = input.karakter || "Bimo, Lala, Bubu";
                                                    const durasi = input.durasi || 4;
                                                      const bahasa = input.bahasa || "Bahasa Indonesia";
                                                        const tujuan = input.tujuan || "Belajar hal baru dan saling membantu";

                                                          const prompt = `
                                                          Kamu adalah penulis cerita profesional untuk animasi anak 3D.

                                                          Buat satu episode animasi anak dengan ketentuan:

                                                          Judul: ${judul}
                                                          Tema: ${tema}
                                                          Karakter: ${karakter}
                                                          Durasi: ${durasi} menit
                                                          Bahasa: ${bahasa}
                                                          Tujuan edukasi: ${tujuan}

                                                          ATURAN:
                                                          1. Cerita harus orisinal dan ramah anak.
                                                          2. Gunakan bahasa sederhana dan mudah dipahami.
                                                          3. Buat cerita yang menarik, lucu, hangat, dan mendidik.
                                                          4. Semua karakter harus memiliki dialog.
                                                          5. Cerita harus memiliki awal, konflik ringan, penyelesaian, dan pesan moral.
                                                          6. Bagi cerita menjadi tepat 7 adegan.
                                                          7. Setiap adegan memiliki deskripsi visual, aksi karakter, dialog, dan durasi.
                                                          8. Total durasi harus mendekati ${durasi} menit.
                                                          9. Sertakan satu bagian lagu anak sederhana yang orisinal.
                                                          10. Jangan meniru karakter atau cerita dari film yang sudah ada.

                                                          FORMAT JAWABAN:

                                                          JUDUL EPISODE

                                                          SINOPSIS

                                                          DAFTAR KARAKTER

                                                          ADEGAN 1 sampai ADEGAN 7:
                                                          - Durasi:
                                                          - Lokasi:
                                                          - Visual:
                                                          - Gerakan karakter:
                                                          - Dialog:
                                                          - Suara dan musik:

                                                          LAGU ANAK

                                                          PESAN MORAL

                                                          PENUTUP
                                                          `;

                                                            const url =
                                                                "https://generativelanguage.googleapis.com/v1beta/models/" +
                                                                    GEMINI_MODEL + ":generateContent";

                                                                      const response = UrlFetchApp.fetch(url, {
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
                                                                                                                                          maxOutputTokens: 6000
                                                                                                                                                }
                                                                                                                                                    }),
                                                                                                                                                        muteHttpExceptions: true
                                                                                                                                                          });

                                                                                                                                                            const status = response.getResponseCode();
                                                                                                                                                              const result = JSON.parse(response.getContentText());

                                                                                                                                                                if (status !== 200) {
                                                                                                                                                                    throw new Error(
                                                                                                                                                                          "Gemini error " + status + ": " +
                                                                                                                                                                                (result.error ? result.error.message : "Permintaan gagal")
                                                                                                                                                                                    );
                                                                                                                                                                                      }

                                                                                                                                                                                        const cerita = result.candidates[0].content.parts
                                                                                                                                                                                            .map(part => part.text || "")
                                                                                                                                                                                                .join("\n");

                                                                                                                                                                                                  return cerita;
                                                                                                                                                                                                  }

                                                                                                                                                                                                  function testGemini() {
                                                                                                                                                                                                    const cerita = buatCerita({
                                                                                                                                                                                                        judul: "Bimo dan Pelangi Ajaib",
                                                                                                                                                                                                            tema: "Belajar mengenal warna",
                                                                                                                                                                                                                karakter: "Bimo, Lala, Bubu",
                                                                                                                                                                                                                    durasi: 4,
                                                                                                                                                                                                                        bahasa: "Bahasa Indonesia",
                                                                                                                                                                                                                            tujuan: "Mengenal warna dan belajar bekerja sama"
                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                Logger.log(cerita);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                