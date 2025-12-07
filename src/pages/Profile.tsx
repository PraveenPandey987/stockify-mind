
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Star, MessageSquare, Calendar, Clock, Activity, UserCircle, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { feedbackService } from '@/services/api';
import ProfileEdit from '@/components/ProfileEdit';

const ActivityItem = ({ icon, title, description, time }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  time: string;
}) => (
  <div className="flex items-start space-x-4 mb-4">
    <div className="bg-primary/10 p-2 rounded-full">
      {icon}
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        <time className="text-xs text-muted-foreground">{time}</time>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  // Get default tab from URL or use 'profile'
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const mockActivity = [
    { 
      icon: <Activity className="h-4 w-4 text-primary" />, 
      title: 'Logged in', 
      description: 'You logged in to your account', 
      time: '2 hours ago' 
    },
    { 
      icon: <Star className="h-4 w-4 text-primary" />, 
      title: 'Watchlist updated', 
      description: 'Added NVDA to your watchlist', 
      time: '1 day ago' 
    },
    { 
      icon: <Calendar className="h-4 w-4 text-primary" />, 
      title: 'Account created', 
      description: 'Welcome to Stockify!', 
      time: '7 days ago' 
    }
  ];
  
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmittingFeedback(true);
    try {
      await feedbackService.submitFeedback({
        rating,
        comment: feedbackComment,
        email: user?.email || ''
      });
      toast.success('Thank you for your feedback!');
      setRating(0);
      setFeedbackComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  
  const handleContactSubmit = async () => {
    if (!contactSubject || !contactMessage) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmittingContact(true);
    try {
      await feedbackService.contactUs({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage
      });
      toast.success('Your message has been sent!');
      setContactSubject('');
      setContactMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSubmittingContact(false);
    }
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <UserCircle className="h-20 w-20 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Not Logged In</h2>
          <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate('/login')} size="lg" className="px-8">
            Log In
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        </div>
        
        <Separator />
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">My Account</h2>
            <TabsList className="self-start">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TabsContent value="profile" className="space-y-6">
              <ProfileEdit />
            </TabsContent>
              
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockActivity.map((activity, index) => (
                    <ActivityItem 
                      key={index}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      time={activity.time}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
              
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Share Your Feedback</span>
                  </CardTitle>
                  <CardDescription>
                    We value your opinion! Let us know how we can improve your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={rating >= value ? "default" : "outline"}
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setRating(value)}
                        >
                          <Star 
                            className={`h-5 w-5 ${rating >= value ? "fill-current" : ""}`} 
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="comment" className="text-sm font-medium">Comments</label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSubmitFeedback} 
                    disabled={isSubmittingFeedback || rating === 0}
                    className="w-full sm:w-auto"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
              
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Contact Us</span>
                  </CardTitle>
                  <CardDescription>
                    Have a question or need help? Send us a message and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm font-medium">Name</label>
                      <Input
                        id="contact-name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="text-sm font-medium">Subject</label>
                    <Input
                      id="contact-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
                    <Textarea
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleContactSubmit} 
                    disabled={isSubmittingContact || !contactSubject || !contactMessage}
                    className="w-full sm:w-auto"
                  >
                    {isSubmittingContact ? 
                      'Sending...' 
                      : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )
                    }
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
