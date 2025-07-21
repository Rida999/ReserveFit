import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrainersSection from "@/components/TrainersSection";
import ProgramsSection from "@/components/ProgramsSection";
import BookingSection from "@/components/BookingSection";
import ChatbotBar from "@/components/ChatbotBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrainersSection />
        <ProgramsSection />
        <BookingSection />
      </main>
      <ChatbotBar />
    </div>
  );
};

export default Index;
