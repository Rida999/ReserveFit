import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Award, Users } from "lucide-react";
import trainerSarah from "@/assets/trainer-sarah.jpg";
import trainerMike from "@/assets/trainer-mike.jpg";

const TrainersSection = () => {
  const trainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Strength Training & HIIT",
      experience: "8 years",
      rating: 4.9,
      clients: 150,
      image: trainerSarah,
      certifications: ["NASM-CPT", "CrossFit Level 2"],
      description: "Specializes in functional movement and high-intensity workouts for maximum results."
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      specialty: "Bodybuilding & Nutrition",
      experience: "10 years",
      rating: 4.8,
      clients: 200,
      image: trainerMike,
      certifications: ["ACSM-CPT", "Precision Nutrition"],
      description: "Expert in muscle building, body composition, and personalized nutrition planning."
    }
  ];

  return (
    <section id="trainers" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Trainers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Work with certified professionals who are passionate about helping you achieve your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto md:mx-0 border-4 border-primary/20"
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{trainer.name}</h3>
                    <p className="text-primary font-semibold mb-3">{trainer.specialty}</p>
                    <p className="text-muted-foreground mb-4">{trainer.description}</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-energy fill-current" />
                        <span className="font-semibold">{trainer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-power" />
                        <span className="text-sm">{trainer.clients}+ clients</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-success" />
                        <span className="text-sm">{trainer.experience}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {trainer.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="power" className="w-full md:w-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book with {trainer.name.split(' ')[0]}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;