import { useState } from "react"


export default function CheckoutPage() {

  const [formData, setFormData] = useState({
    full_name: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
  })

  const [showDetails, setShowDetails] = useState(false);


  const handleFormData = (e) => {
    const { name, value } = e.target;

    if (name === 'postal_code') {

      const numericValue = parseInt(value, 10);
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: isNaN(numericValue) ? '' : numericValue
      }));
    } else if (name === 'country') { // Nuova condizione per countryInitials
      const countryInitials = value.toUpperCase();
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: countryInitials
      })) // Converti in maiuscolo
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const apiBaseUrl = import.meta.env.VITE_API_BASE;




    try {
      const res = await fetch(`${apiBaseUrl}/billing-addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        console.log('dati inviati');
        setShowDetails(true)

      } else {
        console.error('errore durante l\'invio dei dati');
      }
    } catch (error) {
      console.error('si è verificato un problema', error);


    }
  }








  return (
    <>



      <form className="container  mt-5" onSubmit={handleSubmit}>
        <h2 className="text-center">Inserisci i dati per la fatturazzione</h2>
        <div className="row row-cols-1 row-cols-lg-3 gx-5 gy-3 mt-5">
          <div className="mb-3 col-lg-6">
            <label htmlFor="fullname" className="form-label">Nome completo</label>
            <input
              type="text"
              className="form-control  "
              name="full_name"
              value={formData.full_name}
              onChange={handleFormData}
              required
            />
          </div>
          <div className="mb-3 col-lg-6">
            <label htmlFor="address_line" className="form-label">Indirizzo</label>
            <input
              type="text"
              className="form-control"
              name="address_line"
              value={formData.address_line}
              onChange={handleFormData}
              required />
          </div>
          <div className="mb-3 ">
            <label htmlFor="city" className="form-label">Città</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleFormData}
              required />
          </div>
          <div className="mb-3 ">
            <label htmlFor="postal_code" className="form-label">Codice Postale</label>
            <input
              type="text"
              className="form-control"
              name="postal_code"
              maxLength="5"
              minLength="5"
              value={formData.postal_code}
              onChange={handleFormData}
              required />
          </div>
          <div className="mb-3">
            <label htmlFor="countryInitials" className="form-label">Iniziali paese</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleFormData}
              maxLength="2"
              minLength="2"
              required />
          </div>


          <button type="submit" className="btn btn-primary mx-auto my-5 col-6 col-lg-4">Submit</button>
        </div>

      </form>

      {showDetails && (
        <div className="card container " >
          <div className="row row-cols-1 justify-content-center">
            <div className="col col-md-6 col-lg-5" >
              <h5 className="card-title text-center">Riepilogo Dati</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item py-4 "><b>Nome completo</b>: {formData.full_name}</li>
                <li className="list-group-item py-4 "><b>Indirizzo</b>: {formData.address_line}</li>
                <li className="list-group-item py-4"><b>Città</b>: {formData.city}</li>
                <li className="list-group-item py-4 "><b>Codice Postale</b>: {formData.postal_code}</li>
                <li className="list-group-item py-4 "><b>Paese</b>: {formData.country}</li>
              </ul>
            </div>

          </div>

        </div>
      )
      }
    </>


  )
}