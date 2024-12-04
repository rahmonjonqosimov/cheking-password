import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	CheckCircle2,
	Eye,
	EyeOff,
	KeyRound,
	ShieldCheck,
	XCircle,
} from 'lucide-react'
import React, { useState } from 'react'

interface FormData {
	firstName: string
	lastName: string
	birthDate: string
	password: string
}

interface PasswordErrors {
	length: boolean
	uppercase: boolean
	lowercase: boolean
	number: boolean
	symbol: boolean
	containsPersonalInfo: boolean
}

const App: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		firstName: '',
		lastName: '',
		birthDate: '',
		password: '',
	})

	const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
		length: true,
		uppercase: true,
		lowercase: true,
		number: true,
		symbol: true,
		containsPersonalInfo: true,
	})

	const [showPassword, setShowPassword] = useState<boolean>(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))

		if (name === 'password') {
			checkPasswordSecurity(value)
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const checkPasswordSecurity = (password: string) => {
		const errors: PasswordErrors = {
			length: password.length < 8,
			uppercase: !/[A-Z]/.test(password),
			lowercase: !/[a-z]/.test(password),
			number: !/[0-9]/.test(password),
			symbol: !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
			containsPersonalInfo: checkPersonalInfoInPassword(password),
		}

		setPasswordErrors(errors)
	}

	const checkPersonalInfoInPassword = (password: string) => {
		const lowerPassword = password.toLowerCase()
		const lowerFirstName = formData.firstName.toLowerCase()
		const lowerLastName = formData.lastName.toLowerCase()
		const birthYear = new Date(formData.birthDate).getFullYear().toString()

		return (
			lowerPassword.includes(lowerFirstName) ||
			lowerPassword.includes(lowerLastName) ||
			lowerPassword.includes(birthYear)
		)
	}

	const isPasswordSecure = () => {
		return !Object.values(passwordErrors).some(error => error)
	}

	return (
		<div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
			<Card className='w-full max-w-md shadow-2xl border-none'>
				<CardHeader className='text-center bg-blue-500 text-white py-6 rounded-t-xl'>
					<CardTitle className='flex items-center justify-center gap-2'>
						<KeyRound className='w-8 h-8' />
						<span className='text-2xl font-bold'>Parol Xavfsizligi</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='p-6 space-y-4'>
					<div>
						<Label className='text-blue-700'>Ism</Label>
						<Input
							type='text'
							name='firstName'
							value={formData.firstName}
							onChange={handleInputChange}
							placeholder='Ismingizni kiriting'
							className='mt-2 focus:ring-2 focus:ring-blue-300'
						/>
					</div>

					<div>
						<Label className='text-blue-700'>Familiya</Label>
						<Input
							type='text'
							name='lastName'
							value={formData.lastName}
							onChange={handleInputChange}
							placeholder='Familiyangizni kiriting'
							className='mt-2 focus:ring-2 focus:ring-blue-300'
						/>
					</div>

					<div>
						<Label className='text-blue-700'>Tug'ilgan sana</Label>
						<Input
							type='date'
							name='birthDate'
							value={formData.birthDate}
							onChange={handleInputChange}
							className='mt-2 focus:ring-2 focus:ring-blue-300'
						/>
					</div>

					<div className='relative'>
						<Label className='text-blue-700'>Parol</Label>
						<div className='relative'>
							<Input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								placeholder='Parolingizni kiriting'
								className='mt-2 pr-10 focus:ring-2 focus:ring-blue-300'
							/>
							<button
								type='button'
								onClick={togglePasswordVisibility}
								className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors'
							>
								{showPassword ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</button>
						</div>
					</div>

					{formData.password && (
						<div className='bg-blue-50 p-4 rounded-lg'>
							<h3 className='font-semibold mb-3 text-blue-800 flex items-center gap-2'>
								<ShieldCheck className='w-6 h-6' /> Parol tekshiruvi
							</h3>
							<ul className='space-y-2'>
								<PasswordCriterion
									condition={!passwordErrors.length}
									text='Kamida 8 belgidan iborat'
								/>
								<PasswordCriterion
									condition={!passwordErrors.uppercase}
									text='Kamida bitta katta harf'
								/>
								<PasswordCriterion
									condition={!passwordErrors.lowercase}
									text='Kamida bitta kichik harf'
								/>
								<PasswordCriterion
									condition={!passwordErrors.number}
									text='Kamida bitta raqam'
								/>
								<PasswordCriterion
									condition={!passwordErrors.symbol}
									text='Kamida bitta maxsus belgi'
								/>
								<PasswordCriterion
									condition={!passwordErrors.containsPersonalInfo}
									text="Shaxsiy ma'lumotlarni o'z ichiga olmagan"
								/>
							</ul>
						</div>
					)}

					<Button
						disabled={!isPasswordSecure()}
						className='w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300'
					>
						Davom etish
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

interface PasswordCriterionProps {
	condition: boolean
	text: string
}

const PasswordCriterion: React.FC<PasswordCriterionProps> = ({
	condition,
	text,
}) => (
	<li className='flex items-center gap-2 text-sm'>
		{condition ? (
			<CheckCircle2 className='w-5 h-5 text-green-500' />
		) : (
			<XCircle className='w-5 h-5 text-red-500' />
		)}
		<span className={condition ? 'text-green-700' : 'text-red-700'}>
			{text}
		</span>
	</li>
)

export default App
