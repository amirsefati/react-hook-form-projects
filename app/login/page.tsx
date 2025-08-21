'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.email({ error: "ایمیل رو صحیح وارد کنید" }),
    password: z.string().min(5)
})

type LoginFormInput = z.infer<typeof loginSchema>



export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormInput) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                throw new Error("ایمیل یا رمز عبور اشتباه هست")
            }

            const result = await res.json()
            console.log("ورود موفقیت آمیز", result)
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error)); 
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-100 font-vazir">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded=lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">ورود</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-black">ایمیل:</label>
                    <input type="email" {...register("email")} className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
                        }`} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-black">پسورد:</label>
                    <input
                        type="password"
                        {...register("password")}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "تلاش برای ورود..." : "ورود"}
                </button>

            </form>
        </div>
    )
}