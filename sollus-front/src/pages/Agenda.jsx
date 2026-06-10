import React, { useState, useEffect } from 'react';
import {
  Typography, Input, DatePicker, TimePicker, Select,
  Button, Card, Tag, Empty, Row, Col, Form, Calendar, Badge, Modal
} from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import '../styles/agenda.css';

dayjs.locale('pt-br');

const { Title, Text } = Typography;
const { Option } = Select;

export default function Agenda() {
  const [eventos, setEventos] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modalData, setModalData] = useState({ open: false, eventos: [], data: '' });
  const [editModal, setEditModal] = useState({ open: false, evento: null });

  useEffect(() => {
    const salvos = localStorage.getItem('@AppAgenda:eventos');
    if (salvos) setEventos(JSON.parse(salvos));
  }, []);

  const salvarNoStorage = (novaLista) => {
    setEventos(novaLista);
    localStorage.setItem('@AppAgenda:eventos', JSON.stringify(novaLista));
  };

  const handleAddEvento = (values) => {
    const novoEvento = {
      id: Date.now(),
      title: values.title,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time ? values.time.format('HH:mm') : '',
      type: values.type,
    };
    const novaLista = [...eventos, novoEvento].sort((a, b) => a.date.localeCompare(b.date));
    salvarNoStorage(novaLista);
    form.resetFields();
  };

  const removerEvento = (id) => {
    salvarNoStorage(eventos.filter(ev => ev.id !== id));
  };

  const abrirEdicao = (evento) => {
    setEditModal({ open: true, evento });
    editForm.setFieldsValue({
      title: evento.title,
      date: dayjs(evento.date),
      time: evento.time ? dayjs(evento.time, 'HH:mm') : null,
      type: evento.type,
    });
  };

  const handleEditEvento = (values) => {
    const eventoAtualizado = {
      ...editModal.evento,
      title: values.title,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time ? values.time.format('HH:mm') : '',
      type: values.type,
    };
    const novaLista = eventos
      .map(ev => ev.id === eventoAtualizado.id ? eventoAtualizado : ev)
      .sort((a, b) => a.date.localeCompare(b.date));
    salvarNoStorage(novaLista);
    setEditModal({ open: false, evento: null });
    editForm.resetFields();
  };

  const tagColor = (type) => type === 'compromisso' ? 'blue' : 'orange';

  const onSelectDia = (value) => {
    const dataStr = value.format('YYYY-MM-DD');
    const eventosDoDia = eventos.filter(ev => ev.date === dataStr);
    if (eventosDoDia.length > 0) {
      setModalData({ open: true, eventos: eventosDoDia, data: value.format('DD/MM/YYYY') });
    }
  };

  return (
    <div className="agenda-container">

      <Title level={2} className="agenda-titulo">
        <CalendarOutlined />
        Minha Agenda
      </Title>

      <Row gutter={24} align="top">

        {/* Coluna esquerda - Formulário */}
        <Col span={8} style={{ alignSelf: 'flex-start' }}>
          <Card className="agenda-form-card">
            <Form form={form} onFinish={handleAddEvento} layout="vertical">
              <Form.Item
                name="title"
                label="O que precisa fazer?"
                rules={[{ required: true, message: 'Informe o título' }]}
              >
                <Input placeholder="Ex: Reunião com cliente" size="large" />
              </Form.Item>

              <Form.Item name="date" label="Data" rules={[{ required: true, message: 'Informe a data' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
              </Form.Item>

              <Form.Item name="time" label="Horário">
                <TimePicker style={{ width: '100%' }} format="HH:mm" size="large" />
              </Form.Item>

              <Form.Item name="type" label="Tipo" initialValue="compromisso">
                <Select size="large">
                  <Option value="compromisso">Compromisso</Option>
                  <Option value="lembrete">Lembrete</Option>
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" block>
                Adicionar à Agenda
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Coluna direita - Calendário */}
        <Col span={16} style={{ alignSelf: 'flex-start' }}>
          <Card className="agenda-calendario-card" style={{ marginTop: 0, paddingTop: 0 }}>
            <Calendar onSelect={onSelectDia} />
          </Card>
        </Col>

      </Row>

      {/* Lista de eventos */}
      <div className="agenda-lista-separador" />
      <Title level={4} className="agenda-lista-titulo">Todos os compromissos</Title>
      {eventos.length === 0 ? (
        <Empty description="Nenhum compromisso cadastrado ainda." />
      ) : (
        eventos.map(ev => (
          <Card key={ev.id} className="evento-card">
            <div>
              <Text type="secondary" className="evento-data">
                {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                {ev.time && ` - ${ev.time}`}
              </Text>
              <Title level={5} className="evento-titulo">{ev.title}</Title>
              <Tag color={tagColor(ev.type)}>{ev.type}</Tag>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                icon={<EditOutlined />}
                onClick={() => abrirEdicao(ev)}
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removerEvento(ev.id)}
              />
            </div>
          </Card>
        ))
      )}

      {/* Modal visualização do dia */}
      <Modal
        title={`Compromissos em ${modalData.data}`}
        open={modalData.open}
        onCancel={() => setModalData({ ...modalData, open: false })}
        footer={null}
      >
        {modalData.eventos.map(ev => (
          <Card key={ev.id} className="modal-evento-card">
            <div>
              <Text type="secondary">{ev.time}</Text>
              <Title level={5} className="evento-titulo">{ev.title}</Title>
              <Tag color={tagColor(ev.type)}>{ev.type}</Tag>
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                removerEvento(ev.id);
                setModalData({ ...modalData, open: false });
              }}
            />
          </Card>
        ))}
      </Modal>

      {/* Modal de edição */}
      <Modal
        title="Editar compromisso"
        open={editModal.open}
        onCancel={() => {
          setEditModal({ open: false, evento: null });
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditEvento} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="O que precisa fazer?"
            rules={[{ required: true, message: 'Informe o título' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="date" label="Data" rules={[{ required: true, message: 'Informe a data' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
          </Form.Item>

          <Form.Item name="time" label="Horário">
            <TimePicker style={{ width: '100%' }} format="HH:mm" size="large" />
          </Form.Item>

          <Form.Item name="type" label="Tipo">
            <Select size="large">
              <Option value="compromisso">Compromisso</Option>
              <Option value="lembrete">Lembrete</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => {
              setEditModal({ open: false, evento: null });
              editForm.resetFields();
            }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Salvar alterações
            </Button>
          </div>
        </Form>
      </Modal>

    </div>
  );
}