'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tripPlannerFormSchema } from '@/utils/validations';
import {
  FormLabel,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { planTrip } from '@/app/actions/trip-plan-actions';
import { toast } from '@/components/ui/use-toast';

export default function CardWithForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Spanish', value: 'es' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Chinese', value: 'zh' },
  ] as const;

  const form = useForm<z.infer<typeof tripPlannerFormSchema>>({
    resolver: zodResolver(tripPlannerFormSchema),
    defaultValues: {
      tripDays: 1,
      placesPerDay: 1,
      language: 'en',
    },
  });

  const mutation = useMutation({
    mutationFn: planTrip,
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      return data;
    },
  });

  function onSubmit(data: z.infer<typeof tripPlannerFormSchema>) {
    try {
      startTransition(async () => {
        const result: any = (await mutation.mutateAsync(data)) as any;

        // if (!result?.error) {
        //   toast({
        //     title: 'Error',
        //     description: result.error.message,
        //     duration: 5000,
        //     variant: 'destructive',
        //   });
        //   form.reset();
        // } else {
        //   toast({
        //     title: 'Trip planned Successfully',
        //     // description: 'You have been logged in successfully',
        //     duration: 5000,
        //   });
        //   // router.replace('/');
        // }
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  async function onReset() {
    form.reset();
  }

  return (
    <Card className={cn('w-full', 'z-50')}>
      <CardHeader className="text-center space-y-2">
        <CardTitle>Plan Your Trip!</CardTitle>
        <CardDescription>
          Meticulously planned for unforgettable experiences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4 space-y-3">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="tripDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="tripDays">
                        Number of trip days
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Number of trip days"
                          type="number"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="placesPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="placesPerDay">
                        Number of places per day
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Number of places per day"
                          type="number"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Language</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? languages.find(
                                    (language) =>
                                      language.value === field.value,
                                  )?.label
                                : 'Select language'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command className={cn('w-full')}>
                            <CommandInput placeholder="Search state..." />
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              {languages.map((language) => (
                                <CommandItem
                                  value={language.label}
                                  key={language.value}
                                  onSelect={() => {
                                    form.setValue('language', language.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      language.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {language.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CardFooter className="flex justify-between pt-8 px-0">
              <Button variant="outline" type="reset" onClick={onReset}>
                Reset
              </Button>
              <Button type="submit" className="rounded-md">
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? 'Planning' : 'Plan Trip'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
