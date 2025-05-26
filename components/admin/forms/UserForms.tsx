"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import { Student } from '@/app/(root)/types';
import { userSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createUser } from '@/lib/admin/actions/user';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@radix-ui/react-select';

interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const UserForms = ({
  type, 
  ...user
}: Props) => {
  const router = useRouter();

  const onSubmit = async(values: z.infer<typeof userSchema>,)=>{
    const result = await createUser(values);
    const date = new Date().toUTCString();

    if(result.success){
      toast.success("User Inserted!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      })

      router.push(`/admin/create/${result.data.id}`)
    } else {
      toast.error("Error Occured.", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Unsuccessful"),
        },
      })
    }
  }

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
        role: "",
        password: "", 
        firstName: "", 
        middleName: "", 
        lastName: "", 
        email: "", 
        phone: "",
    }
  });

  

  return (
      <Form {...userForm}>
        <form 
        onSubmit={userForm.handleSubmit(onSubmit)} 
        className="space-y-8 flex flex-col items-start w-full p-6 bg-dark-300 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <FormField 
              control={userForm.control}
              name={"lastName"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          Last Name*
                      </FormLabel>
                      <FormControl>
                          <Input
                              required
                              placeholder="Enter last name"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
              control={userForm.control}
              name={"firstName"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          First Name*
                      </FormLabel>
                      <FormControl>
                          <Input
                              required
                              placeholder="Enter first name"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
              control={userForm.control}
              name={"middleName"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          Middle Name
                      </FormLabel>
                      <FormControl>
                          <Input
                              placeholder="Enter middle name"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormField 
              control={userForm.control}
              name={"email"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          Email*
                      </FormLabel>
                      <FormControl>
                          <Input
                              required
                              placeholder="Enter email address"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
              control={userForm.control}
              name={"phone"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          Phone Number*
                      </FormLabel>
                      <FormControl>
                          <Input
                              required
                              placeholder="Enter phone number"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormField 
              control={userForm.control}
              name={"password"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                          Password*
                      </FormLabel>
                      <FormControl>
                          <Input
                              required
                              placeholder="Enter password"
                              {...field}
                              className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
              control={userForm.control}
              name={"role"}
              render={({field})=>(
                  <FormItem className='flex flex-col gap-1 w-full'>
                      <FormLabel className="text-base font-normal text-gray-400">
                        Role*
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-dark-400 border-dark-400 text-white placeholder:text-gray-600">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-300 text-white border-dark-400">
                            <SelectGroup>
                              <SelectLabel className="text-gray-400">Roles</SelectLabel>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div className="flex gap-4 mt-4 self-end">
              <Button type="button" variant="outline" onClick={()=> router.back()} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 text-white hover:bg-green-600">
                Add User
              </Button>
            </div>
        </form>
      </Form>
      
  )
}

export default UserForms
