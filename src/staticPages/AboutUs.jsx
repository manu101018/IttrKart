import "./aboutUs.css";
const AboutUs = () => {
  const topView = () => {
    window.scrollTo({ top: 0 });
  };

  topView();
  return (
    <div className="about-container">
      <p className="heading">About Us</p>
      <div className="about-text-container">
        <p className="aboutText">
          IttrKart is an E-marketplace for Ittr of Kannauj.Our Aim is to provide
          a platform for the customers and sellers for purchasing and selling of
          Ittr.This project will come under the ODOP (One District One Product).
        </p>
        <p className="aboutText">
          The inspiration behind the creation of IttrKart to provide plateform
          to sell their products on Global market.After visiting the GMDIC
          Office and FFDC Kannauj, we have observed that Ittr producers or
          Sellers are facing many challenges.Mostly Sellers have some fixed
          customers for their products.Traditional farming and manufacturing
          techniques of Ittr is still to get the globally fame.
        </p>
        <p className="aboutText">
          Kannauj Attar is fast emerging and one of the most trusted Direct to
          Consumer brand specialized in traditional distillation of natural
          fragrances, essential oils and herbal ingredients from plant parts and
          flowers using traditional attar making process.
        </p>
        <p className="aboutText">
          This project is developed by final year student of REC Kannauj Mausam,
          Manjeet Singh, Hemant Kaushik under the guidence of Dr. B.D.K Patro.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;