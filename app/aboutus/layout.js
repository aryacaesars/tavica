
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutUsLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
