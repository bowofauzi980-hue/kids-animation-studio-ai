
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
    var callback = params.callback || "";

      if (callback && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
          return ContentService.createTextOutput("Callback tidak valid.");
            }

              try {
                  // Tes koneksi
                      if (params.action !== "generate") {
                            return kirimJSON({
                                    success: true,
                                            status: "online",
                                                    app: "Kids Animation Studio AI",
                                                            message: "Koneksi backend berhasil."
                                                                  }, callback);
                                                                      }

                                                                          // Periksa input
                                                                              if (!params.tema) {
                                                                                    throw new Error("Tema cerita wajib diisi.");
                                                                                        }

                                                                                            // Hubungkan ke mesin Gemini di Code.gs
                                                                                                var hasilCerita = buatCerita({
                                                                                                      judul: params.judul || "Petualangan Anak",
                                                                                                            tema: params.tema,
                                                                                                                  karakter: params.karakter || "Bimo, Lala, Bubu",
                                                                                                                        durasi: params.durasi || 4,
                                                                                                                              bahasa: params.bahasa || "Bahasa Indonesia",
                                                                                                                                    tujuan: params.tujuan || "Belajar dan bekerja sama"
                                                                                                                                        });

                                                                                                                                            return kirimJSON({
                                                                                                                                                  success: true,
                                                                                                                                                        status: "berhasil",
                                                                                                                                                              cerita: hasilCerita
                                                                                                                                                                  }, callback);

                                                                                                                                                                    } catch (error) {
                                                                                                                                                                        return kirimJSON({
                                                                                                                                                                              success: false,
                                                                                                                                                                                    status: "error",
                                                                                                                                                                                          message: error.message
                                                                                                                                                                                              }, callback);
                                                                                                                                                                                                }
                                                                                                                                                                                                }

                                                                                                                                                                                                function kirimJSON(data, callback) {
                                                                                                                                                                                                  var hasil = JSON.stringify(data);

                                                                                                                                                                                                    if (callback) {
                                                                                                                                                                                                        return ContentService
                                                                                                                                                                                                              .createTextOutput(callback + "(" + hasil + ");")
                                                                                                                                                                                                                    .setMimeType(ContentService.MimeType.JAVASCRIPT);
                                                                                                                                                                                                                      }

                                                                                                                                                                                                                        return ContentService
                                                                                                                                                                                                                            .createTextOutput(hasil)
                                                                                                                                                                                                                                .setMimeType(ContentService.MimeType.JSON);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                