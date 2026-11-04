import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Calendar, Clock, User, Phone, Mail, Video, MessageSquare, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PatientConsultations = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConsultations();
    }
  }, [user, isAuthenticated]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultation_details')
        .select('*')
        .eq('patient_id', user.id)
        .order('consultation_date', { ascending: true });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      // For demo purposes, show placeholder data
      setConsultations([
        {
          id: 'demo-1',
          doctor_name: 'Dr. Priya Sharma',
          doctor_email: 'priya@ayurseva.com',
          doctor_specialization: 'Panchakarma Specialist',
          consultation_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 30,
          consultation_type: 'video',
          status: 'confirmed',
          chief_complaint: 'Digestive issues and bloating',
          consultation_fee: 1500,
          payment_status: 'paid'
        },
        {
          id: 'demo-2',
          doctor_name: 'Dr. Rajesh Kumar',
          doctor_email: 'rajesh@ayurseva.com',
          doctor_specialization: 'Digestive Health Expert',
          consultation_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 45,
          consultation_type: 'video',
          status: 'completed',
          chief_complaint: 'Stress and anxiety management',
          consultation_fee: 1200,
          payment_status: 'paid',
          diagnosis: 'Vata imbalance causing anxiety and digestive issues',
          treatment_plan: 'Ashwagandha supplements, meditation, dietary changes',
          lifestyle_recommendations: 'Regular sleep schedule, yoga, warm foods'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cancelConsultation = async (consultationId) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'cancelled' })
        .eq('id', consultationId);

      if (error) throw error;
      
      // Update local state
      setConsultations(prev => 
        prev.map(c => c.id === consultationId ? { ...c, status: 'cancelled' } : c)
      );
    } catch (error) {
      console.error('Error cancelling consultation:', error);
    }
  };

  const filterConsultationsByStatus = (status) => {
    const now = new Date();
    if (status === 'upcoming') {
      return consultations.filter(c => 
        ['pending', 'confirmed', 'in-progress'].includes(c.status) && 
        new Date(c.consultation_date) > now
      );
    }
    if (status === 'completed') {
      return consultations.filter(c => c.status === 'completed');
    }
    if (status === 'cancelled') {
      return consultations.filter(c => c.status === 'cancelled');
    }
    return consultations;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to view your consultations.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
          <p className="text-gray-600 mt-2">View and manage your Ayurvedic consultations</p>
        </div>

        <div className="mb-6">
          <Button onClick={() => navigate('/doctors')} className="bg-green-600 hover:bg-green-700">
            Book New Consultation
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({filterConsultationsByStatus('upcoming').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filterConsultationsByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({filterConsultationsByStatus('cancelled').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('upcoming').map((consultation) => (
                <PatientConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onCancel={cancelConsultation}
                  showActions={true}
                />
              ))}
              {filterConsultationsByStatus('upcoming').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No upcoming consultations</p>
                  <Button onClick={() => navigate('/doctors')}>Book Your First Consultation</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('completed').map((consultation) => (
                <PatientConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  showActions={false}
                />
              ))}
              {filterConsultationsByStatus('completed').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed consultations</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('cancelled').map((consultation) => (
                <PatientConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  showActions={false}
                />
              ))}
              {filterConsultationsByStatus('cancelled').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No cancelled consultations</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PatientConsultationCard = ({ consultation, onCancel, showActions }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const canCancel = () => {
    const consultationDate = new Date(consultation.consultation_date);
    const now = new Date();
    const hoursDifference = (consultationDate - now) / (1000 * 60 * 60);
    return consultation.status === 'confirmed' && hoursDifference > 24;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {consultation.doctor_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span>{consultation.doctor_specialization}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(consultation.consultation_date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {consultation.duration_minutes} minutes
              </span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(consultation.status)}>
            {getStatusIcon(consultation.status)}
            <span className="ml-1 capitalize">{consultation.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {consultation.doctor_email}
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Chief Complaint:</p>
            <p className="text-sm text-gray-600">{consultation.chief_complaint}</p>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {consultation.consultation_type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                {consultation.consultation_type}
              </Badge>
              <Badge variant="outline">
                <CreditCard className="h-3 w-3 mr-1" />
                ₹{consultation.consultation_fee}
              </Badge>
              <Badge variant="outline" className={consultation.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                {consultation.payment_status}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {showActions && canCancel() && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel(consultation.id)}
                >
                  Cancel
                </Button>
              )}
              {consultation.status === 'confirmed' && (
                <Button size="sm">
                  Join Consultation
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </Button>
            </div>
          </div>

          {/* Detailed Information */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {consultation.diagnosis && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Diagnosis:</p>
                  <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                </div>
              )}
              
              {consultation.treatment_plan && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Treatment Plan:</p>
                  <p className="text-sm text-gray-600">{consultation.treatment_plan}</p>
                </div>
              )}
              
              {consultation.lifestyle_recommendations && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Lifestyle Recommendations:</p>
                  <p className="text-sm text-gray-600">{consultation.lifestyle_recommendations}</p>
                </div>
              )}
              
              {consultation.consultation_notes && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Doctor's Notes:</p>
                  <p className="text-sm text-gray-600">{consultation.consultation_notes}</p>
                </div>
              )}
              
              {consultation.follow_up_date && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Follow-up Date:</p>
                  <p className="text-sm text-gray-600">{formatDate(consultation.follow_up_date)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Consultation Booking Component
export const ConsultationBooking = () => {
  const { doctorSlug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    consultation_date: '',
    consultation_time: '',
    duration_minutes: 30,
    consultation_type: 'video',
    chief_complaint: '',
    symptoms: '',
    medical_history: '',
    current_medications: ''
  });

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorSlug]);

  const fetchDoctorDetails = async () => {
    try {
      // For demo purposes, use fallback doctor data
      const fallbackDoctor = {
        id: 'doctor-1',
        name: 'Dr. Priya Sharma',
        specialization: 'Panchakarma Specialist',
        experience: '15 years',
        consultation_fee: 1500,
        email: 'priya@ayurseva.com'
      };
      setDoctor(fallbackDoctor);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const consultationDateTime = new Date(`${bookingData.consultation_date}T${bookingData.consultation_time}`);
      
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          patient_id: user.id,
          doctor_id: doctor.id,
          consultation_date: consultationDateTime.toISOString(),
          duration_minutes: bookingData.duration_minutes,
          consultation_type: bookingData.consultation_type,
          chief_complaint: bookingData.chief_complaint,
          symptoms: bookingData.symptoms,
          medical_history: bookingData.medical_history,
          current_medications: bookingData.current_medications,
          consultation_fee: doctor.consultation_fee,
          status: 'pending'
        }]);

      if (error) throw error;
      
      navigate('/consultations');
    } catch (error) {
      console.error('Error booking consultation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
          <Button onClick={() => navigate('/doctors')}>Browse Doctors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Consultation</h1>
          <p className="text-gray-600 mt-2">Schedule your appointment with {doctor.name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p><strong>Experience:</strong> {doctor.experience}</p>
                <p><strong>Consultation Fee:</strong> ₹{doctor.consultation_fee}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.consultation_date}
                      onChange={(e) => setBookingData({...bookingData, consultation_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingData.consultation_time}
                      onChange={(e) => setBookingData({...bookingData, consultation_time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={bookingData.duration_minutes.toString()} onValueChange={(value) => setBookingData({...bookingData, duration_minutes: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Consultation Type</Label>
                    <Select value={bookingData.consultation_type} onValueChange={(value) => setBookingData({...bookingData, consultation_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="audio">Audio Call</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="complaint">Chief Complaint</Label>
                  <Textarea
                    id="complaint"
                    value={bookingData.chief_complaint}
                    onChange={(e) => setBookingData({...bookingData, chief_complaint: e.target.value})}
                    placeholder="Describe your main health concern..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({...bookingData, symptoms: e.target.value})}
                    placeholder="List your symptoms..."
                  />
                </div>

                <div>
                  <Label htmlFor="history">Medical History</Label>
                  <Textarea
                    id="history"
                    value={bookingData.medical_history}
                    onChange={(e) => setBookingData({...bookingData, medical_history: e.target.value})}
                    placeholder="Any relevant medical history..."
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={bookingData.current_medications}
                    onChange={(e) => setBookingData({...bookingData, current_medications: e.target.value})}
                    placeholder="List any medications you're currently taking..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Book Consultation - ₹{doctor.consultation_fee}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientConsultations;

