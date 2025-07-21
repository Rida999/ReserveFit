import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dumbbell, 
  Heart, 
  Target, 
  Zap, 
  Users, 
  Clock,
  TrendingUp,
  Flame
} from "lucide-react";

const ProgramsSection = () => {
  const programs = [
    {
      id: 1,
      name: "Strength Training",
      description: "Build lean muscle and increase overall strength with personalized weightlifting programs.",
      icon: Dumbbell,
      duration: "45-60 min",
      intensity: "High",
      color: "text-primary",
      bgColor: "bg-primary/10",
      features: ["Progressive overload", "Form correction", "Custom rep schemes"]
    },
    {
      id: 2,
      name: "HIIT Workouts",
      description: "High-intensity interval training for maximum calorie burn and cardiovascular fitness.",
      icon: Zap,
      duration: "30-45 min",
      intensity: "Very High",
      color: "text-energy",
      bgColor: "bg-energy/10",
      features: ["Fat burning", "Metabolic boost", "Time efficient"]
    },
    {
      id: 3,
      name: "Cardio Conditioning",
      description: "Improve endurance and heart health with varied cardiovascular training methods.",
      icon: Heart,
      duration: "45-60 min",
      intensity: "Medium",
      color: "text-power",
      bgColor: "bg-power/10",
      features: ["Endurance building", "Heart health", "Recovery sessions"]
    },
    {
      id: 4,
      name: "Functional Fitness",
      description: "Real-world movement patterns to improve daily activities and prevent injuries.",
      icon: Target,
      duration: "45 min",
      intensity: "Medium",
      color: "text-success",
      bgColor: "bg-success/10",
      features: ["Movement quality", "Injury prevention", "Daily life skills"]
    },
    {
      id: 5,
      name: "Weight Loss",
      description: "Comprehensive program combining cardio, strength, and nutrition guidance.",
      icon: TrendingUp,
      duration: "60 min",
      intensity: "Variable",
      color: "text-primary",
      bgColor: "bg-primary/10",
      features: ["Calorie tracking", "Meal planning", "Progress monitoring"]
    },
    {
      id: 6,
      name: "Athletic Performance",
      description: "Sport-specific training to enhance athletic performance and competitive edge.",
      icon: Flame,
      duration: "60-90 min",
      intensity: "Very High",
      color: "text-energy",
      bgColor: "bg-energy/10",
      features: ["Sport-specific drills", "Power development", "Agility training"]
    }
  ];

  return (
    <section id="programs" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Training Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our diverse range of training programs designed to meet your specific fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <Card key={program.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${program.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${program.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {program.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {program.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{program.duration}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      program.intensity === 'Very High' ? 'bg-red-100 text-red-700' :
                      program.intensity === 'High' ? 'bg-orange-100 text-orange-700' :
                      program.intensity === 'Medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {program.intensity}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="energy" size="lg">
            <Users className="mr-2 h-5 w-5" />
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;