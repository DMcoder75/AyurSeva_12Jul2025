import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, XCircle, AlertCircle, Video, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DoctorConsultations = () => {
  const { user, isDoctor } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [lifestyleRecommendations, setLifestyleRecommendations] = useState('');

  console.log('🏥 DoctorConsultations component initialized');
  console.log('👤 User object:', user);
  console.log('🩺 isDoctor() result:', isDoctor());

  useEffect(() => {
    console.log('🔄 useEffect triggered with user:', user);
    console.log('🔄 useEffect - isDoctor():', isDoctor());
    
    if (isDoctor() && user) {
      console.log('✅ Conditions met - calling fetchConsultations');
      fetchConsultations();
    } else {
      console.log('❌ Conditions not met:');
      console.log('   - isDoctor():', isDoctor());
      console.log('   - user exists:', !!user);
    }
  }, [user, isDoctor]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching consultations for doctor:', user.id);
      
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctor_id', user.id)
        .order('consultation_date', { ascending: true });

      console.log('📊 Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Consultations fetched successfully:', data?.length || 0, 'records');
      setConsultations(data || []);
    } catch (error) {
      console.error('💥 Error fetching consultations:', error);
      console.log('🔄 Using demo data as fallback');
      
      // For demo purposes, show placeholder data
      setConsultations([
        {
          id: 'demo-1',
          patient_name: 'John Doe',
          patient_email: 'john@example.com',
          patient_phone: '+1-555-0123',
          consultation_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 30,
          consultation_type: 'video',
          status: 'pending',
          chief_complaint: 'Digestive issues and bloating',
          symptoms: 'Frequent bloating after meals, irregular bowel movements',
          consultation_fee: 1500,
          payment_status: 'paid'
        },
        {
          id: 'demo-2',
          patient_name: 'Sarah Smith',
          patient_email: 'sarah@example.com',
          patient_phone: '+1-555-0124',
          consultation_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 45,
          consultation_type: 'video',
          status: 'confirmed',
          chief_complaint: 'Stress and anxiety management',
          symptoms: 'Difficulty sleeping, constant worry, fatigue',
          consultation_fee: 1800,
          payment_status: 'paid'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', consultationId);

      if (error) throw error;
      
      // Update local state
      setConsultations(prev => 
        prev.map(c => c.id === consultationId ? { ...c, status: newStatus } : c)
      );
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  const saveConsultationNotes = async (consultationId) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({
          consultation_notes: consultationNotes,
          diagnosis: diagnosis,
          treatment_plan: treatmentPlan,
          lifestyle_recommendations: lifestyleRecommendations,
          status: 'completed'
        })
        .eq('id', consultationId);

      if (error) throw error;
      
      // Update local state
      setConsultations(prev => 
        prev.map(c => c.id === consultationId ? { 
          ...c, 
          consultation_notes: consultationNotes,
          diagnosis: diagnosis,
          treatment_plan: treatmentPlan,
          lifestyle_recommendations: lifestyleRecommendations,
          status: 'completed'
        } : c)
      );
      
      setSelectedConsultation(null);
      setConsultationNotes('');
      setDiagnosis('');
      setTreatmentPlan('');
      setLifestyleRecommendations('');
    } catch (error) {
      console.error('Error saving consultation notes:', error);
    }
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
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filterConsultationsByStatus = (status) => {
    if (status === 'pending') return consultations.filter(c => c.status === 'pending');
    if (status === 'upcoming') return consultations.filter(c => ['confirmed', 'in-progress'].includes(c.status));
    if (status === 'completed') return consultations.filter(c => c.status === 'completed');
    return consultations;
  };

  if (!isDoctor()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only doctors can access consultation management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consultation Management</h1>
          <p className="text-gray-600 mt-2">Manage your patient consultations and appointments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({filterConsultationsByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({filterConsultationsByStatus('upcoming').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filterConsultationsByStatus('completed').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('pending').map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onStatusUpdate={updateConsultationStatus}
                  onViewDetails={setSelectedConsultation}
                />
              ))}
              {filterConsultationsByStatus('pending').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending consultations</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('upcoming').map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onStatusUpdate={updateConsultationStatus}
                  onViewDetails={setSelectedConsultation}
                />
              ))}
              {filterConsultationsByStatus('upcoming').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming consultations</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {filterConsultationsByStatus('completed').map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onStatusUpdate={updateConsultationStatus}
                  onViewDetails={setSelectedConsultation}
                />
              ))}
              {filterConsultationsByStatus('completed').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed consultations</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Consultation Details Modal */}
        {selectedConsultation && (
          <ConsultationDetailsModal
            consultation={selectedConsultation}
            onClose={() => setSelectedConsultation(null)}
            onSaveNotes={saveConsultationNotes}
            consultationNotes={consultationNotes}
            setConsultationNotes={setConsultationNotes}
            diagnosis={diagnosis}
            setDiagnosis={setDiagnosis}
            treatmentPlan={treatmentPlan}
            setTreatmentPlan={setTreatmentPlan}
            lifestyleRecommendations={lifestyleRecommendations}
            setLifestyleRecommendations={setLifestyleRecommendations}
          />
        )}
      </div>
    </div>
  );
};

const ConsultationCard = ({ consultation, onStatusUpdate, onViewDetails }) => {
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
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {consultation.patient_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
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
              {consultation.patient_email}
            </span>
            {consultation.patient_phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {consultation.patient_phone}
              </span>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Chief Complaint:</p>
            <p className="text-sm text-gray-600">{consultation.chief_complaint}</p>
          </div>
          
          {consultation.symptoms && (
            <div>
              <p className="text-sm font-medium text-gray-900">Symptoms:</p>
              <p className="text-sm text-gray-600">{consultation.symptoms}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {consultation.consultation_type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                {consultation.consultation_type}
              </Badge>
              <Badge variant="outline">₹{consultation.consultation_fee}</Badge>
            </div>
            
            <div className="flex gap-2">
              {consultation.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(consultation.id, 'cancelled')}
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(consultation.id, 'confirmed')}
                  >
                    Accept
                  </Button>
                </>
              )}
              {consultation.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => onStatusUpdate(consultation.id, 'in-progress')}
                >
                  Start Consultation
                </Button>
              )}
              {consultation.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => onViewDetails(consultation)}
                >
                  Complete & Add Notes
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(consultation)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ConsultationDetailsModal = ({ 
  consultation, 
  onClose, 
  onSaveNotes,
  consultationNotes,
  setConsultationNotes,
  diagnosis,
  setDiagnosis,
  treatmentPlan,
  setTreatmentPlan,
  lifestyleRecommendations,
  setLifestyleRecommendations
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Consultation Details</h2>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {consultation.patient_name}</p>
                <p><strong>Email:</strong> {consultation.patient_email}</p>
                <p><strong>Phone:</strong> {consultation.patient_phone}</p>
                <p><strong>Date:</strong> {new Date(consultation.consultation_date).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {consultation.duration_minutes} minutes</p>
              </div>
              
              <h4 className="text-md font-semibold mt-6 mb-2">Chief Complaint</h4>
              <p className="text-gray-700">{consultation.chief_complaint}</p>
              
              {consultation.symptoms && (
                <>
                  <h4 className="text-md font-semibold mt-4 mb-2">Symptoms</h4>
                  <p className="text-gray-700">{consultation.symptoms}</p>
                </>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Consultation Notes</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter your diagnosis..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder="Enter treatment plan..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lifestyle">Lifestyle Recommendations</Label>
                  <Textarea
                    id="lifestyle"
                    value={lifestyleRecommendations}
                    onChange={(e) => setLifestyleRecommendations(e.target.value)}
                    placeholder="Enter lifestyle recommendations..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Enter consultation notes..."
                    className="mt-1"
                  />
                </div>
                
                {consultation.status === 'in-progress' && (
                  <Button 
                    onClick={() => onSaveNotes(consultation.id)}
                    className="w-full"
                  >
                    Complete Consultation & Save Notes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultations;

