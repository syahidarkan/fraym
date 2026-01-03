'use client'

import React, { useState } from 'react'
import { X, User, Mail, Lock, Upload } from 'lucide-react'
import styles from './AccountSettingsModal.module.css'

interface AccountSettingsModalProps {
    onClose: () => void
}

export default function AccountSettingsModal({ onClose }: AccountSettingsModalProps) {
    const [name, setName] = useState('John Doe')
    const [email, setEmail] = useState('john.doe@example.com')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSave = () => {
        // Validate passwords match
        if (newPassword && newPassword !== confirmPassword) {
            if (typeof window !== 'undefined' && (window as any).showToast) {
                (window as any).showToast('Passwords do not match!', 'error')
            }
            return
        }

        const accountData = {
            name,
            email
        }
        localStorage.setItem('wireframe-account', JSON.stringify(accountData))

        if (typeof window !== 'undefined' && (window as any).showToast) {
            (window as any).showToast('Account settings saved!', 'success')
        }
        onClose()
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Account Settings</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Profile Picture */}
                    <div className={styles.section}>
                        <h3>Profile Picture</h3>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <User size={40} />
                            </div>
                            <button className={styles.uploadButton}>
                                <Upload size={16} />
                                Upload Photo
                            </button>
                            <p className={styles.hint}>JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className={styles.section}>
                        <h3>Profile Information</h3>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User size={16} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={16} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className={styles.section}>
                        <h3>Change Password</h3>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={16} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={16} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={16} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className={styles.section}>
                        <h3>Notifications</h3>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Email notifications</span>
                            </label>
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Project updates</span>
                            </label>
                            <label>
                                <input type="checkbox" />
                                <span>Marketing emails</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
