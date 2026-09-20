import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsGuideScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header tự chế căn giữa tuyệt đối */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Tài liệu hướng dẫn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner tổng quan đầu trang */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="book" size={28} color="#ffb74d" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.bannerTitle}>HDSD Ứng Dụng Giám Sát Bé Yêu</Text>
            <Text style={styles.bannerDesc}>Tài liệu chi tiết hướng dẫn vận hành hệ thống phần cứng và phần mềm.</Text>
          </View>
        </View>

        {/* Chương 1 */}
        <View style={styles.chapterCard}>
          <View style={styles.chapterHeaderRow}>
            <Ionicons name="log-in-outline" size={22} color="#21335b" />
            <Text style={styles.chapterTitle}>Chương 1: Khởi động và Đăng nhập</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Đăng ký tài khoản mới bằng địa chỉ Gmail cá nhân của bạn.</Text>
            <Text style={styles.bulletText}>• Sử dụng tính năng "Ghi nhớ thiết bị đăng nhập" ở màn hình chính để tự động vào thẳng ứng dụng ở những lần mở app sau mà không cần gõ lại mật khẩu.</Text>
            <Text style={styles.bulletText}>• Hỗ trợ tính năng quên mật khẩu qua email xác thực.</Text>
          </View>
        </View>

        {/* Chương 2 */}
        <View style={styles.chapterCard}>
          <View style={styles.chapterHeaderRow}>
            <Ionicons name="home-outline" size={22} color="#21335b" />
            <Text style={styles.chapterTitle}>Chương 2: Quản lý Trang chủ (Home)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Theo dõi trực quan trạng thái của bé (Ví dụ: "YÊN BÌNH" màu xanh khi bé ngủ ngoan).</Text>
            <Text style={styles.bulletText}>• Kiểm tra số lượng Node cảm biến (ESP32) đang kết nối trực tuyến.</Text>
            <Text style={styles.bulletText}>• Thống kê nhanh số lần phát hiện tiếng khóc trong ngày.</Text>
          </View>
        </View>

        {/* Chương 3 */}
        <View style={styles.chapterCard}>
          <View style={styles.chapterHeaderRow}>
            <Ionicons name="hardware-chip-outline" size={22} color="#21335b" />
            <Text style={styles.chapterTitle}>Chương 3: Giám sát Thiết bị phần cứng</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Quản lý danh sách các Node cảm biến đặt tại phòng ngủ, phòng khách hoặc nhà bếp.</Text>
            <Text style={styles.bulletText}>• Theo dõi trạng thái hoạt động Online/Offline của từng phần cứng.</Text>
          </View>
        </View>

        {/* Chương 4 */}
        <View style={styles.chapterCard}>
          <View style={styles.chapterHeaderRow}>
            <Ionicons name="time-outline" size={22} color="#21335b" />
            <Text style={styles.chapterTitle}>Chương 4: Lịch sử Cảnh báo & Thống kê</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Xem lại danh sách chi tiết các mốc thời gian bé khóc hoặc hệ thống phát hiện tiếng động bất thường.</Text>
            <Text style={styles.bulletText}>• Tra cứu lịch sử theo ngày tháng thông qua bộ lọc lịch trực quan.</Text>
          </View>
        </View>

        {/* Chương 5 */}
        <View style={styles.chapterCard}>
          <View style={styles.chapterHeaderRow}>
            <Ionicons name="settings-outline" size={22} color="#21335b" />
            <Text style={styles.chapterTitle}>Chương 5: Cài đặt và Tùy chỉnh hệ thống</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Thay đổi tên hiển thị cá nhân và cập nhật mật khẩu tài khoản bảo mật.</Text>
            <Text style={styles.bulletText}>• Tùy chỉnh chế độ rung, bật/tắt thông báo Pop-up nổi ngay trên màn hình điện thoại.</Text>
            <Text style={styles.bulletText}>• Lựa chọn nhạc chuông báo động mặc định hoặc tải lên file MP3 tùy chỉnh riêng.</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f5f7' },
  customHeader: { 
    backgroundColor: '#21335b', 
    paddingTop: 45, 
    paddingBottom: 16, 
    paddingHorizontal: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%'
  },
  backButton: { padding: 4 },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  container: { flex: 1, padding: 16 },
  
  bannerCard: { 
    backgroundColor: '#21335b', 
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 3
  },
  bannerIconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  bannerDesc: { color: '#cfd8dc', fontSize: 13, lineHeight: 18 },

  chapterCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chapterHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  chapterTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#21335b', 
    marginLeft: 10 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#f0f0f0', 
    marginBottom: 12 
  },
  bulletList: { 
    paddingLeft: 4 
  },
  bulletText: { 
    fontSize: 14, 
    color: '#444', 
    lineHeight: 22, 
    marginBottom: 8 
  }
});