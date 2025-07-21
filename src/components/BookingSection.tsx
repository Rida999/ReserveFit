import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    trainer: '',
    program: '',
    date: '',
    time: '',
    goals: ''
  });

  const trainers = [
    { id: 'sarah', name: 'Sarah Johnson', specialty: 'Strength Training & HIIT' },
    { id: 'mike', name: 'Mike Rodriguez', specialty: 'Bodybuilding & Nutrition' }
  ];

  const programs = [
    'Strength Training',
    'HIIT Workouts',
    'Cardio Conditioning',
    'Functional Fitness',
    'Weight Loss',
    'Athletic Performance'
  ];

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.trainer || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking submission
    toast({
      title: "Session Booked! 🎉",
      description: `Your training session with ${trainers.find(t => t.id === formData.trainer)?.name} has been scheduled for ${formData.date} at ${formData.time}.`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      trainer: '',
      program: '',
      date: '',
      time: '',
      goals: ''
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-primary/5 via-power/5 to-energy/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Book Your Training Session
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your fitness journey? Schedule a personalized training session with one of our expert trainers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Schedule Your Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="trainer" className="text-sm font-semibold">Choose Trainer *</Label>
                      <Select value={formData.trainer} onValueChange={(value) => updateFormData('trainer', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a trainer" />
                        </SelectTrigger>
                        <SelectContent>
                          {trainers.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.id}>
                              <div>
                                <div className="font-medium">{trainer.name}</div>
                                <div className="text-sm text-muted-foreground">{trainer.specialty}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="program" className="text-sm font-semibold">Training Program</Label>
                      <Select value={formData.program} onValueChange={(value) => updateFormData('program', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-semibold">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateFormData('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="time" className="text-sm font-semibold">Preferred Time *</Label>
                        <Select value={formData.time} onValueChange={(value) => updateFormData('time', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div>
                  <Label htmlFor="goals" className="text-sm font-semibold">Fitness Goals & Notes</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => updateFormData('goals', e.target.value)}
                    placeholder="Tell us about your fitness goals, any injuries, or special requirements..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button type="submit" variant="energy" size="lg" className="px-12">
                    <Target className="mr-2 h-5 w-5" />
                    Book My Session
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;