import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.io.IOException;

public class DocSync {

    public static void main(String[] args) {
        String sourceFile = "system-design.md";
        String targetFile = "system-document.md";

        Path sourcePath = Paths.get(sourceFile);
        Path targetPath = Paths.get(targetFile);

        try {
            // Membaca semua baris dari file sumber
            if (!Files.exists(sourcePath)) {
                System.out.println("Error: File sumber " + sourceFile + " tidak ditemukan.");
                return;
            }

            List<String> lines = Files.readAllLines(sourcePath);

            // Membuat header untuk dokumen target
            String timeStamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String header = "<!-- AUTO-GENERATED DOCUMENT -->\n"
                          + "<!-- Terakhir disinkronisasi: " + timeStamp + " -->\n\n"
                          + "# System Documentation (Hasil Sinkronisasi)\n\n"
                          + "> Dokumen ini dibuat dan disinkronisasi secara otomatis dari `" + sourceFile + "`.\n"
                          + "> Harap **JANGAN** mengubah dokumen ini secara manual.\n\n"
                          + "---\n\n";

            // Menulis header dan isi ke dokumen target (timpa jika ada)
            Files.writeString(targetPath, header, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.write(targetPath, lines, StandardOpenOption.APPEND);

            System.out.println("Sinkronisasi berhasil! Data dari " + sourceFile + " telah disalin ke " + targetFile);

        } catch (IOException e) {
            System.err.println("Terjadi kesalahan saat menyinkronisasi file: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
