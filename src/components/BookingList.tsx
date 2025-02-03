"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Check, X, Trash2, MessageCircle, Upload } from "lucide-react";
import LoadingModal from "./LoadingModal";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";

interface Appointment {
  id: string;
  trigger: string;
  status: string;
  page: string;
  agency: string;
  booker: { name: string; whatsapp: string };
  broker: { name: string; whatsapp: string; accompany: string };
  property: { id: string; address: string; neighborhood: string };
  services: string;
  schedule: { start: { day: string; hour: string }; end: string };
  notes?: string;
  rejectedReason?: string;
  cancelledReason?: string;
  rescheduleReason?: string;
}

export default function BookingList() {
  const [sessions, setSessions] = useState<{ [date: string]: Appointment[] }>({});
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const openRejectModal = () => setShowRejectModal(true);

  useEffect(() => {
    setLoading(true)
    async function fetchAppointments() {
        const response:any = await fetch("https://whatsapp-cr.onrender.com/booking/list"); 
        const data = await response.json();
        
        const currentDate = new Date(
            new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
          );
        const appointmentsArray = Array.isArray(data.data) ? data.data : [];

      // Agrupar os agendamentos por data
        const groupedSessions = appointmentsArray.reduce((acc: { [date: string]: Appointment[] }, appointment: any) => {
            const date = appointment.schedule.start.day; // Exemplo: "30/01/2025"
            const [day, month, year] = date.split("/").map(Number);
            const appointmentDate = new Date(year, month - 1, day, ...appointment.schedule.start.hour.split(":").map(Number));
            if (appointmentDate < currentDate) return acc;
            if (!acc[date]) acc[date] = [];
            acc[date].push(appointment);
            return acc;
        }, {});

            // Ordenar as datas de forma decrescente (do mais recente para o mais antigo)
        const sortedSessions = Object.entries(groupedSessions).sort(([dateA], [dateB]) => {
            const [dayA, monthA, yearA] = dateA.split("/").map(Number);
            const [dayB, monthB, yearB] = dateB.split("/").map(Number);
            const dateAObj = new Date(yearA, monthA - 1, dayA); // Convertendo para objeto Date
            const dateBObj = new Date(yearB, monthB - 1, dayB);
    
            return dateAObj.getTime() - dateBObj.getTime(); // Ordenação decrescente
            });
    
            // Reorganizando para um objeto com as datas ordenadas
            const orderedSessions: any = Object.fromEntries(sortedSessions);
            setSessions(orderedSessions);
    }

    fetchAppointments();
    setLoading(false)
    if(update){
      setUpdate(false)
    }
  }, [update]);

  async function handleAccept(){
    setLoading(true)
    setSelectedAppointment(null)
    const response: any = await fetch(`https://whatsapp-cr.onrender.com/booking/${selectedAppointment?.id}/confirm`)
    const res = response.json()
    if(res.error){
      setLoading(false)
      setStatus('error')
      setTimeout(()=>{
        setStatus(null)
      }, 2500)
    } else {
      setLoading(false)
      setStatus('success')
      setTimeout(()=>{
        setStatus(null)
        setUpdate(true)
      }, 2500)
    }
  }

  async function handleCancel(){
    setLoading(true)
    setSelectedAppointment(null)
    const response: any = await fetch(`https://whatsapp-cr.onrender.com/booking/${selectedAppointment?.id}/cancel`)
    const res = response.json()
    if(res.error){
      setLoading(false)
      setStatus('error')
      setTimeout(()=>{
        setStatus(null)
      }, 2500)
    } else {
      setLoading(false)
      setStatus('success')
      setTimeout(()=>{
        setStatus(null)
        setUpdate(true)
      }, 2500)
    }
  }

 async function handleReject(){
  setLoading(true)
  setShowRejectModal(false)
  setSelectedAppointment(null)
  const response: any = await fetch(`https://whatsapp-cr.onrender.com/booking/${selectedAppointment?.id}/decline`)
  const res = response.json()
  console.log(res)
  if(res.status != 200){
    setLoading(false)
    setStatus('error')
    setTimeout(()=>{
      setStatus(null)
    }, 2500)
  } else {
    setLoading(false)
    setStatus('success')
    setTimeout(()=>{
      setStatus(null)
      setUpdate(true)
    }, 2500)
  }
  }

  return (
    <>
    {loading && (
        <LoadingModal />
    )} {status == 'success' ? (
      <SuccessModal />
    ) : status == 'error' && (
      <ErrorModal />
    )}
    <h2 className="text-2xl font-bold text-center mb-2 pt-4">agendamentos</h2>
    <div className="p-4 overflow-auto max-h-[75vh] scrollbar-hide justify-self-center">
      <div className="space-y-4 w-[300px]">
        {Object.keys(sessions).length === 0 ? (
          <p className="text-center text-gray-500">nenhum agendamento disponível.</p>
        ) : (
          Object.entries(sessions).map(([date, appointments]) => (
            <div key={date} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">{date}</h3>
              <ul className="mt-2">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className={`p-4 mb-4 rounded shadow-md cursor-pointer hover:bg-gray-100 ${
                        appointment.trigger === 'BOOKING_CANCELLED' ? 'bg-red-200' : 'bg-white'
                      }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    {appointment.schedule.start.hour} - {appointment.broker.name} | {appointment.agency} {appointment.status == 'PENDING' ? (
                        <p className="font-bold">status: pendente</p>
                    ) : appointment.trigger == 'BOOKING_CREATED' || appointment.trigger == 'BOOKING_RESCHEDULE' ? (
                        <p>status: aceito</p>
                    ) : appointment.trigger == 'BOOKING_REJECTED' ? (
                        <p>status: recusado</p>
                    ) : appointment.trigger == 'BOOKING_CANCELLED' && (
                        <p>status: cancelado</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 ">
          <div className={`${selectedAppointment.trigger == 'BOOKING_CANCELLED' || selectedAppointment.trigger == 'BOOKING_REJECTED' 
          ? 'bg-red-100' : 'bg-white'} p-6 rounded-lg shadow-lg w-[500px]`}>
            <h3 className="text-xl font-bold">agência {selectedAppointment.agency}</h3>

            {/* 📆 Data e Horário (início - fim) */}
            <p className="text-gray-600 mt-2">
              Data: {selectedAppointment.schedule.start.day} | Horário:{" "}
              {selectedAppointment.schedule.start.hour} - {selectedAppointment.schedule.end}
            </p>

            {/* 🗺️ Link para o Google Maps */}
            <p className="text-gray-600 mt-1 flex items-center gap-1">
                <MapPin size={16} className="text-red-500" />
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedAppointment.property.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {selectedAppointment.property.address}
                </a>
            </p>


            <p className="text-gray-600 mt-1">Bairro: {selectedAppointment.property.neighborhood}</p>
            <p className="text-gray-600 mt-1">Serviço: {selectedAppointment.services}</p>
            <p className="text-gray-600 mt-1">Status: {' '}
                {selectedAppointment.status == 'PENDING' ? (
                <span>Pendente</span>
            ) : selectedAppointment.trigger =='BOOKING_CREATED' || selectedAppointment.trigger == 'BOOKING_RESCHEDULE' ? (
                <span>Aceito</span>
            ) : selectedAppointment.trigger == 'BOOKING_REJECTED' ? (
                <span>Rejeitado</span>
            ) : selectedAppointment.trigger == 'BOOKING_CANCELLED' && (
                <span>Cancelado</span>
            )}
            </p>
            {selectedAppointment.notes && (
              <p className="text-gray-500 mt-2">Observações: {selectedAppointment.notes}</p>
            )}

            {/* Exibição das razões (se existirem) */}
            {(selectedAppointment.rescheduleReason || selectedAppointment.rejectedReason || selectedAppointment.cancelledReason) && (
                <div className="mb-4">
                    <p>
                        {selectedAppointment.rescheduleReason
                        ? `Motivo do reagendamento: ${selectedAppointment.rescheduleReason}`
                        : selectedAppointment.rejectedReason
                        ? `Motivo da rejeição: ${selectedAppointment.rejectedReason}`
                        : `Motivo da cancelamento: ${selectedAppointment.cancelledReason}`}
                    </p>
                </div>
            )}

            {/* 🔘 Botões de Ação */}
            <div className="flex justify-end mt-4 space-x-1">
                {selectedAppointment.status === "PENDING" && (
                <>
                    <button
                    onClick={() => handleAccept()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                    >
                    <Check size={16} /> Aceitar
                    </button>
                    <button
                    onClick={() => openRejectModal()}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
                    >
                    <X size={16} /> Rejeitar
                    </button>
                </>
                )}

                {selectedAppointment.status !== "PENDING" && selectedAppointment.trigger !== "BOOKING_CANCELLED" && (
                <button
                    onClick={() => handleCancel()}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                >
                    <Trash2 size={16} /> Cancelar
                </button>
                )}

                <a
                href={`https://wa.me/${selectedAppointment.broker.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 flex items-center gap-2"
                >
                <MessageCircle size={16} /> WhatsApp
                </a>

                <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
                >
                <X size={16} /> Fechar
                </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Digite o motivo da rejeição"
              className="w-full h-32 p-4 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={()=>handleReject()} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Confirmar Rejeição</button>
              <button onClick={() => setShowRejectModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
