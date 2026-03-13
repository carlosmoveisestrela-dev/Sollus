import React, { useState, useEffect } from 'react';
import Layout from "../layouts/layout.jsx"
import '../styles/agenda.css';

export default function Agenda() {
    const [eventos, setEventos] = useState([]);
    const [form, setForm] = useState({ title: '', date: '', time: '', type: 'compromisso' });

    // Carregar dados ao iniciar
    useEffect(() => {
        const salvos = localStorage.getItem('@AppAgenda:eventos');
        if (salvos) setEventos(JSON.parse(salvos));
    }, []);

    // Salvar sempre que a lista mudar
    const salvarNoStorage = (novaLista) => {
        setEventos(novaLista);
        localStorage.setItem('@AppAgenda:eventos', JSON.stringify(novaLista));
    };

    const handleAddEvento = (e) => {
        e.preventDefault();
        if (!form.title || !form.date) return;

        const novoEvento = { ...form, id: Date.now() };
        const novaLista = [...eventos, novoEvento].sort((a, b) => a.date.localeCompare(b.date));

        salvarNoStorage(novaLista);
        setForm({ title: '', date: '', time: '', type: 'compromisso' }); // Limpar form
    };

    const removerEvento = (id) => {
        const filtrados = eventos.filter(ev => ev.id !== id);
        salvarNoStorage(filtrados);
    };

    return (
        <Layout>
            <div className="agenda-page">
                <h1>Minha Agenda</h1>

                {/* Formulário de Cadastro */}
                <section className="agenda-form-container">
                    <form onSubmit={handleAddEvento} className="agenda-form">
                        <input
                            type="text"
                            placeholder="O que precisa de fazer?"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                        <div className="form-row">
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                            <input
                                type="time"
                                value={form.time}
                                onChange={e => setForm({ ...form, time: e.target.value })}
                            />
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="compromisso">Compromisso</option>
                                <option value="lembrete">Lembrete</option>
                            </select>
                        </div>
                        <button type="submit">Adicionar à Agenda</button>
                    </form>
                </section>

                {/* Listagem de Compromissos */}
                <section className="agenda-list">
                    {eventos.length === 0 ? (
                        <p className="empty-msg">Nenhum compromisso marcado para hoje.</p>
                    ) : (
                        eventos.map(ev => (
                            <div key={ev.id} className={`event-card ${ev.type}`}>
                                <div className="event-info">
                                    <span className="event-date">{new Date(ev.date).toLocaleDateString('pt-PT')} - {ev.time}</span>
                                    <h3>{ev.title}</h3>
                                    <span className="badge">{ev.type}</span>
                                </div>
                                <button onClick={() => removerEvento(ev.id)} className="btn-delete">×</button>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </Layout>
    )
}