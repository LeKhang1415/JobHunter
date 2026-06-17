import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white tracking-wider">
                            JobHunter
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Kết nối nhân tài với các công ty hàng đầu. Bước tiến sự nghiệp tiếp theo của bạn bắt đầu từ đây.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
                            Dành Cho Ứng Viên
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/jobs" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Tìm Việc Làm</Link></li>
                            <li><Link to="/companies" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Tìm Công Ty</Link></li>
                            <li><Link to="/candidate/profile" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Bảng Điều Khiển</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Việc Làm Đã Lưu</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
                            Dành Cho Nhà Tuyển Dụng
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/recruiter/company" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Đăng Tin Tuyển Dụng</Link></li>
                            <li><Link to="/recruiter/company" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Bảng Điều Khiển</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300">Bảng Giá</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
                            Liên Hệ
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start group">
                                <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">123 JobHunter St, Tech City, TC 10100</span>
                            </li>
                            <li className="flex items-center group">
                                <Phone className="h-5 w-5 mr-3 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center group">
                                <Mail className="h-5 w-5 mr-3 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">support@jobhunter.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} JobHunter. Bản quyền đã được bảo hộ.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition-colors duration-300">Chính Sách Bảo Mật</Link>
                        <Link to="#" className="hover:text-white transition-colors duration-300">Điều Khoản Dịch Vụ</Link>
                        <Link to="#" className="hover:text-white transition-colors duration-300">Chính Sách Cookie</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
