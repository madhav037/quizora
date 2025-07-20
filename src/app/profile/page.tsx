"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    bio: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    const res = await fetch("/api/admin");
    const data = await res.json();

    if (data?.user) {
      setUser(data.user);
      setFormData({
        name: data.user.name || "",
        phone_number: data.user.phone_number || "",
        bio: data.user.bio || "",
        avatar_url: data.user.avatar_url || ""
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (result.status === 200) {
      await fetchUser(); // Refresh user data
      setEditing(false);
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-[400px] rounded-xl bg-[#1e2230]" />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 bg-gradient-to-b from-[#0f172a] via-[#1e2230] to-[#0f172a] rounded-xl shadow-lg">
      <Card className="bg-[#1f2937] text-white border border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-400">Profile Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-indigo-500">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {!editing && <p className="text-sm text-slate-300">{user.email}</p>}
          </div>

          {editing ? (
            <div className="grid gap-4">
              <div>
                <Label className="text-indigo-300">Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[#111827] border-indigo-700 text-white"
                />
              </div>
              <div>
                <Label className="text-indigo-300">Phone Number</Label>
                <Input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="bg-[#111827] border-indigo-700 text-white"
                />
              </div>
              <div>
                <Label className="text-indigo-300">Avatar URL</Label>
                <Input
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="bg-[#111827] border-indigo-700 text-white"
                />
              </div>
              <div>
                <Label className="text-indigo-300">Bio</Label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="bg-[#111827] border-indigo-700 text-white"
                />
              </div>

              <div className="flex justify-between gap-4 mt-4">
                <Button
                  onClick={() => setEditing(false)}
                  className="bg-red-600 hover:bg-red-700 text-white w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm text-slate-300">
              <p><span className="text-indigo-400 font-medium">Name:</span> {user.name}</p>
              <p><span className="text-indigo-400 font-medium">Email:</span> {user.email}</p>
              <p><span className="text-indigo-400 font-medium">Role:</span> {user.role}</p>
              <p><span className="text-indigo-400 font-medium">Last Login:</span> {new Date(user.last_login).toLocaleString()}</p>
              <p><span className="text-indigo-400 font-medium">Created At:</span> {new Date(user.created_at).toLocaleString()}</p>
              <p><span className="text-indigo-400 font-medium">Updated At:</span> {new Date(user.updated_at).toLocaleString()}</p>
              <p><span className="text-indigo-400 font-medium">Phone:</span> {user.phone_number || "-"}</p>
              <p><span className="text-indigo-400 font-medium">Bio:</span> {user.bio || "-"}</p>
              <Button
                onClick={() => setEditing(true)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role based content */}
      {user.role === "creator" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-indigo-400 mb-2">Your Hosted Quizzes</h2>
          <p className="text-sm text-slate-400">Coming soon...</p>
        </div>
      )}

      {user.role === "participant" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-indigo-400 mb-2">Quizzes You Participated In</h2>
          <p className="text-sm text-slate-400">Coming soon...</p>
        </div>
      )}
    </div>
  );
}
