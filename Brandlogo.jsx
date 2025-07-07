function Brandlogo() {
  function Brandlogo() {
    const brands = [
      {
        name: "H&M",
        logo: "https://img.freepik.com/free-photo/portrait-smiling-beautiful-girl-her-handsome-boyfriend-laughing_158538-4885.jpg",
      },
    ];

    return (
      <section className="dashboard-brand-logos">
        {brands.map((brand, index) => (
          <img key={index} src={brand.logo} alt={`${brand.name} logo`} />
        ))}
      </section>
    );
  }
}
export default Brandlogo;
