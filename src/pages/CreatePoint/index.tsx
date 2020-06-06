import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";

import axios from "axios";
import api from "../../services/api";

import "./styles.css";

import logo from "../../assets/logo.svg";

//sempre que é criado um estado para um array ou para um objeto,  precisamos manualmente informar
// o tipo da variável que será armazenada ali dentro.

interface Item {
  title: string;
  image_url: string;
}

interface Uf {
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<Uf[]>([]);
  const [selectedUfs, setSelectedUfs] = useState("0");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");

  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => {
        setUfs(response.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUfs}/municipios
`
      )
      .then((response) => {
        setCities(response.data);
      });
  }, [selectedUfs]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (value === "0") return;
    setSelectedUfs(value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (value === "0") return;
    setSelectedCity(value);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>
      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados da entidade</h2>
          </legend>
          <div className="field">
            <label>Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
              <label>E-mail</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label>Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={[-22.904832, -43.106304]} zoom={15}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[-22.904832, -43.106304]} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label>Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUfs}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.nome}
                  </option>
                ))}
                ;
              </select>
            </div>
            <div className="field">
              <label>Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens de abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item, index) => (
              <li key={index}>
                <img src={item.image_url} alt="oleo" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button>Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
