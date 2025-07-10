// src/pages/Profile/index.js
import React, { useState, useEffect, useContext } from 'react';
import './profile.css';

import { AuthContext }      from '../../contexts/auth';
import Header               from '../../components/Header';
import Title                from '../../components/Title';
import avatarPlaceholder    from '../../assets/avatar.png';

import { toast }            from 'react-toastify';
import { FiSettings, FiUpload } from 'react-icons/fi';

import { getProfile, updateProfile } from '../../api/profile';
// import firebase from '../../services/firebaseConnection'; // TODO: revisit storage strategy

function Profile() {
  const { user, setUser, storageUser } = useContext(AuthContext);

  const [nome,      setNome]      = useState('');
  const [profissao, setProfissao] = useState('');
  const [idade,     setIdade]     = useState('');
  const [receita,   setReceita]   = useState('');
  const [email]                   = useState(user.email);
  const [avatarURL, setAvatarURL] = useState('');

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    getProfile(user.id)
      .then(u => {
        setNome(u.nome);
        setProfissao(u.profissao || '');
        setIdade(u.idade || '');
        setReceita(u.receita || '');
        setAvatarURL(u.avatarUrl || '');
      })
      .catch(() => toast.error('Erro ao carregar perfil'));
  }, [user.id]);

  // Preview selected image
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png','image/jpeg'].includes(file.type)) {
      toast.error('Envie PNG ou JPEG');
      return;
    }
    setImageFile(file);
    setAvatarURL(URL.createObjectURL(file));
  }

  // TODO: Implement actual upload (e.g. S3, Firebase, etc.)
  async function uploadAvatarAndSave(dataToSave) {
    // if (imageFile) {
    //   // TODO: upload to your storage and get back a URL
    //   const storageRef = firebase.storage().ref(`images/${user.uid}/${imageFile.name}`);
    //   await storageRef.put(imageFile);
    //   const url = await storageRef.getDownloadURL();
    //   dataToSave.avatarUrl = url;
    // }
    return updateProfile(user.id, dataToSave);
  }

  // Handle form submit
  async function handleSave(e) {
    e.preventDefault();
    try {
      const payload = { nome, profissao, idade, receita };
      const updatedUser = await uploadAvatarAndSave(payload);
      setUser(updatedUser);
      storageUser(updatedUser);
      toast.success('Perfil atualizado');
    } catch {
      toast.error('Erro ao salvar perfil');
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title nome="Meu Perfil"><FiSettings size={25}/></Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span><FiUpload color="#fff" size={25}/></span>
              <input type="file" accept="image/*" onChange={handleFile}/>
              <img
                src={avatarURL || avatarPlaceholder}
                width={250} height={250}
                alt="Avatar"/>
            </label>

            <div className="form-container">
              {[
                ['Nome',      nome,      setNome],
                ['Profissão', profissao, setProfissao],
                ['Idade',     idade,     setIdade],
                ['Receita',   receita,   setReceita],
              ].map(([label, val, setter]) => (
                <div className="form-box" key={label}>
                  <span className="details">{label}</span>
                  <input
                    type="text"
                    value={val}
                    onChange={e => setter(e.target.value)}
                  />
                </div>
              ))}

              <div className="form-box">
                <span className="details">Email</span>
                <input type="text" value={email} disabled />
              </div>
            </div>

            <button className="btn-submit" type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
