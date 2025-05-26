import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const studentsData = [
  {
    id: "ST2023001",
    fullName: "John Dave",
    program: "Computer Science",
    gpa: "3.8",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023002",
    fullName: "Emmanuel Ungab",
    program: "Business Administration",
    gpa: "4.2",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023003",
    fullName: "Ken Jervis Reyes",
    program: "Accountancy",
    gpa: "4.0",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023004",
    fullName: "Mark Ilagan",
    program: "Education",
    gpa: "3.7",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023005",
    fullName: "Ronald Requioma",
    program: "Computer Science",
    gpa: "3.9",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023006",
    fullName: "Jullian Cruz",
    program: "Computer Science",
    gpa: "3.8",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023007",
    fullName: "Kyle Ordaz",
    program: "Computer Science",
    gpa: "3.8",
    status: "Active",
    torStatus: "Pending",
  },
  {
    id: "ST2023008",
    fullName: "Prince Sadsad",
    program: "Criminology",
    gpa: "3.5",
    status: "Active",
    torStatus: "Pending",
  },
];

const Page = () => {
  return (
    <div className="w-full h-full flex justify-center items-start py-8">
      <div className="w-full max-w-6xl bg-stone-900 rounded-2xl p-8 mx-auto text-white">
        <h2 className="text-2xl font-bold font-['Inter'] leading-9 mb-6">Student Database</h2>

        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search students..."
            className="w-56 bg-zinc-800 rounded-lg border border-neutral-700 text-neutral-400 placeholder:text-neutral-400"
          />
          <Select>
            <SelectTrigger className="w-32 bg-zinc-800 rounded-lg border border-neutral-700 text-neutral-400">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-neutral-400">
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">Full Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">Program</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">GPA</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">TOR Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {studentsData.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-normal text-white">{student.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-normal text-white">{student.fullName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-normal text-white">{student.program}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-normal text-white">{student.gpa}</td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-normal ${student.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{student.status}</td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-normal ${student.torStatus === 'Pending' ? 'text-red-500' : 'text-green-500'}`}>{student.torStatus}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Button className="bg-emerald-400 hover:bg-emerald-500 text-black">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page
