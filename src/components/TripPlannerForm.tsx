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
import { tripPlannerFormSchema } from '@/utils/validations/itirenaryValidations';
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
import axios from 'axios';
import useItineraryStore, {
  Itinerary,
  ItineraryStoreActions,
} from '@/stores/iternary-store';
import prisma from '@/lib/db';

export default function CardWithForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [countries, setCountries]: any[] = React.useState([]);
  const [states, setStates]: any[] = React.useState([]);
  const [cities, setCities]: any[] = React.useState([]);
  const [countryCode, setCountryCode] = React.useState<string>('');
  const [stateCode, setStateCode] = React.useState<string>('');
  const [countrySelected, setCountrySelected] = React.useState<boolean>(false);
  const [stateSelected, setStateSelected] = React.useState<boolean>(false);
  const changeItinerary = useItineraryStore(
    (state: ItineraryStoreActions) => state.setItinerary,
  );

  const form = useForm<z.infer<typeof tripPlannerFormSchema>>({
    resolver: zodResolver(tripPlannerFormSchema),
    defaultValues: {
      tripDays: 1,
      placesPerDay: 1,
      country: '',
      state: '',
      city: '',
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
    console.log(data, 'data');
    try {
      startTransition(async () => {
        if (data.country === '' || data.state === '' || data.city === '') {
          toast({
            title: 'Error',
            description: 'Please select a country, state and city',
            duration: 5000,
            variant: 'destructive',
          });
          return;
        }
        const result: Itinerary = (await mutation.mutateAsync(
          data,
        )) as Itinerary;

        if (!result) {
          toast({
            title: 'Error',
            description: "Couldn't plan trip, please try again later.",
            duration: 5000,
            variant: 'destructive',
          });
          form.reset();
        } else {
          toast({
            title: 'Trip planned Successfully',
            // description: 'You have been logged in successfully',
            duration: 5000,
          });
        }
        changeItinerary(result);
        // if(result){
        //   await prisma.
        // }
        console.log(result, 'parsedResult');
        const tripId = String(result.id);
        router.push(`/trip/${tripId}`);
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  async function onReset() {
    form.reset();
  }

  React.useEffect(() => {
    const config1 = {
      method: 'get',
      url: 'https://api.countrystatecity.in/v1/countries',
      headers: {
        'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_LOCATIONS_API_KEY as string,
      },
    };

    try {
      axios(config1)
        .then(function (response) {
          const data = response.data;
          // console.log(data);
          setCountries(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    if ((countryCode === '' && countries.length === 0) || !countryCode) return;
    const config2 = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${String(countryCode)}/states`,
      headers: {
        'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_LOCATIONS_API_KEY as string,
      },
    };
    try {
      axios(config2)
        .then(function (response) {
          const res = response.data;
          setStates(res);
          // console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [countries.length, countryCode]);

  React.useEffect(() => {
    if ((stateCode === '' && states.length === 0) || !stateCode) return;
    var config3 = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${String(countryCode)}/states/${String(stateCode)}/cities`,
      headers: {
        'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_LOCATIONS_API_KEY as string,
      },
    };

    try {
      axios(config3)
        .then(function (response) {
          const res = response.data;
          // console.log(res);
          setCities(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [countryCode, stateCode, states.length]);

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
              <div className="grid grid-cols-2 gap-4">
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
                          required
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          required
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
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select a country</FormLabel>
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
                                ? countries.find(
                                    (country: any) =>
                                      country.name === field.value,
                                  )?.name
                                : 'Select Country'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] h-60 p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Country..."
                              required
                            />
                            <CommandEmpty>No Country Found.</CommandEmpty>
                            <CommandGroup className="overflow-y-scroll">
                              {countries.map((country: any) => (
                                <CommandItem
                                  value={country.name}
                                  key={country.id}
                                  onSelect={() => {
                                    form.setValue('country', country.name);
                                    setCountryCode(country.iso2);
                                    setCountrySelected(true);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      country.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {country.name}
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select a state</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!countrySelected}
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? states.find(
                                    (st: any) => st.name === field.value,
                                  )?.name
                                : 'Select state'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px]  h-60 p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search State..."
                              required
                            />
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup className="overflow-y-scroll">
                              {states.map((st: any) => (
                                <CommandItem
                                  value={st.name}
                                  key={st.id}
                                  onSelect={() => {
                                    form.setValue('state', st.name);
                                    setStateCode(st.iso2);
                                    setStateSelected(true);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      st.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {st.name}
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select a city</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!stateSelected}
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? cities.find(
                                    (ct: any) => ct.name === field.value,
                                  )?.name
                                : 'Select city'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px]  h-60 p-0">
                          <Command>
                            <CommandInput placeholder="Search City..." />
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup className="overflow-y-scroll">
                              {cities.map((ct: any) => (
                                <CommandItem
                                  value={ct.name}
                                  key={ct.id}
                                  onSelect={() => {
                                    form.setValue('city', ct.name);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      ct.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {ct.name}
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
