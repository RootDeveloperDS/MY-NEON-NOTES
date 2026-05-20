'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginPage() {
  const [loading, setLoading] = useState<false | 'google' | 'email' | 'reset'>(false);
  const [isPersistent, setIsPersistent] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();
  const persistenceMode = isPersistent ? 'persistent' : 'temporary';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleGoogleSignIn = async () => {
    setLoading('google');
    try {
      await signInWithGoogle(persistenceMode);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-in Error', description: error.message });
      setLoading(false);
    }
  };
  
  const handleEmailSubmit = async (values: z.infer<typeof formSchema>, action: 'signIn' | 'signUp') => {
    setLoading('email');
    try {
      if (action === 'signIn') {
        await signInWithEmail(values.email, values.password, persistenceMode);
      } else {
        await signUpWithEmail(values.email, values.password, persistenceMode);
        toast({ title: 'Account Created', description: "You've been signed up successfully!" });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email').trim();
    if (!email) {
      toast({ variant: 'destructive', title: 'Missing Email', description: 'Enter your email to reset your password.' });
      return;
    }

    setLoading('reset');
    try {
      await resetPassword(email);
      toast({ title: 'Password Reset Sent', description: 'Check your inbox for the reset link.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Reset Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm border-primary/50 bg-card/80 shadow-[0_0_15px_hsl(var(--primary)/0.5)] backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">NEON NOTES</CardTitle>
          <CardDescription>System Access Protocol</CardDescription>
        </CardHeader>
        <CardContent>
        <Tabs defaultValue="signin" className="w-full">
            {/* TabsList: make it responsive with flex and gap for mobile */}
            <TabsList className=" flex w-full justify-between gap-2 sm:gap-4">
              <TabsTrigger 
                value="signin" 
                className="flex-1 text-center whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2"
              >
                Sign In
              </TabsTrigger>

              <TabsTrigger 
                value="signup" 
                className="flex-1 text-center whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2"
              >
                New User
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form>
                <TabsContent value="signin" className="space-y-4 pt-4">
                  <AuthFormFields form={form} />
                  <SessionToggle isPersistent={isPersistent} onChange={setIsPersistent} />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={handlePasswordReset}
                      disabled={!!loading}
                    >
                      Reset password
                    </Button>
                  </div>
                  <Button 
                    onClick={form.handleSubmit(v => handleEmailSubmit(v, 'signIn'))} 
                    disabled={!!loading} 
                    className="w-full"
                  >
                    {loading === 'email' ? <Loader className="animate-spin" /> : 'Sign In'}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 pt-4">
                  <AuthFormFields form={form} />
                  <SessionToggle isPersistent={isPersistent} onChange={setIsPersistent} />
                  <Button 
                    onClick={form.handleSubmit(v => handleEmailSubmit(v, 'signUp'))} 
                    disabled={!!loading} 
                    className="w-full"
                  >
                    {loading === 'email' ? <Loader className="animate-spin" /> : 'Sign Up'}
                  </Button>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="font-note w-full" onClick={handleGoogleSignIn} disabled={!!loading}>
            {loading === 'google' ? <Loader className="animate-spin" /> : <><GoogleIcon className="mr-2" /> Google</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


function AuthFormFields({ form }: { form: any }) {
    return (
        <>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="user@gmail.com" className="font-auth-input" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="P4$sW9rd" className="font-auth-input" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

function SessionToggle({
  isPersistent,
  onChange,
}: {
  isPersistent: boolean;
  onChange: (value: boolean) => void;
}) {
  const toggleId = 'session-toggle';

  return (
    <div className="flex items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 shadow-[0_0_18px_rgba(34,211,238,0.35)] backdrop-blur-md">
      <div className="space-y-1">
        <Label htmlFor={toggleId} className="text-[11px] uppercase tracking-[0.28em] text-cyan-200">
          Session Mode
        </Label>
        <p className="text-xs text-cyan-100/70">
          {isPersistent
            ? 'Persistent session (stored on this device)'
            : 'Temporary session (clears when tab closes)'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-cyan-200/70">TEMP</span>
        <Switch
          id={toggleId}
          checked={isPersistent}
          onCheckedChange={onChange}
          className="border border-cyan-300/60 bg-cyan-500/10 shadow-[0_0_12px_rgba(34,211,238,0.55)] data-[state=checked]:bg-cyan-400/70"
        />
        <span className="text-[10px] font-semibold text-cyan-100">PERSIST</span>
      </div>
    </div>
  );
}
