import { useEffect, useRef, useState } from 'react'
import { apiBaseUrl } from '../config/api.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { itemCategories } from '../data/mockItems.js'
import './ReportItem.css'

export const campusZones = [
  'Academic Blocks (Block 32 to 38)',
  'Central Library / Study Commons',
  'Student Centre / UniMall / Food Court (NK)',
  'Robo Park / Central Lawns',
  'Boys Hostels (BH-1 to BH-7)',
  'Girls Hostels (GH-1 to GH-6)',
  'Sports Complex & Grounds',
  'Campus Main Gates (Gate 1 - 3)',
  'Other Campus Area',
]

const initialValues = {
  type: 'Lost',
  name: '',
  category: '',
  customCategory: '',
  description: '',
  date: '',
  locationZone: '',
  locationDetail: '',
  verificationQuestion: '',
  whatsappNumber: '',
  contactNumber: '',
  emailAddress: '',
  contactPreference: 'Share my contact details only with interested students.',
  shareWithInterestedOnly: true,
}

const maxPhotoSize = 5 * 1024 * 1024
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const currentDate = new Date()
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className="field-inline-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="field-inline-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="field-inline-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="field-inline-icon shield-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ReportItem({ currentUser, onCancel, onNavigate }) {
  const [values, setValues] = useState(initialValues)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [errors, setErrors] = useState({})
  const [confirmation, setConfirmation] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const formRef = useRef(null)
  const submissionInProgressRef = useRef(false)

  // Pre-fill email if logged in user has an email
  useEffect(() => {
    if (currentUser?.email) {
      setValues((prev) => ({
        ...prev,
        emailAddress: prev.emailAddress || currentUser.email,
      }))
    }
  }, [currentUser])

  useEffect(() => {
    if (!photoPreview) return undefined
    return () => URL.revokeObjectURL(photoPreview)
  }, [photoPreview])

  const updateValue = (event) => {
    const { name, value } = event.target
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'category' && value !== 'Other') {
        next.customCategory = ''
      }
      return next
    })
    setConfirmation(null)
    setSubmitError('')
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
    if (name === 'category' && value !== 'Other' && errors.customCategory) {
      setErrors((current) => ({ ...current, customCategory: '' }))
    }
    if (['whatsappNumber', 'contactNumber', 'emailAddress'].includes(name) && errors.contact) {
      setErrors((current) => ({ ...current, contact: '' }))
    }
  }

  // Enforces purely numeric digits 0-9 and limits to exactly 10 digits
  const handlePhoneChange = (event) => {
    const { name, value } = event.target
    const onlyDigits = value.replace(/\D/g, '').slice(0, 10)
    setValues((current) => ({
      ...current,
      [name]: onlyDigits,
    }))
    setConfirmation(null)
    setSubmitError('')
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
    if (errors.contact) {
      setErrors((current) => ({ ...current, contact: '' }))
    }
  }

  const selectPhoto = (event) => {
    const selected = event.target.files?.[0] || null
    event.target.value = ''
    setPhotoError('')
    setConfirmation(null)
    setSubmitError('')

    if (!selected) return
    if (!supportedImageTypes.includes(selected.type)) {
      setPhoto(null)
      setPhotoPreview('')
      setPhotoError('Choose a JPG, PNG or WebP image.')
      return
    }
    if (selected.size > maxPhotoSize) {
      setPhoto(null)
      setPhotoPreview('')
      setPhotoError('The image must be 5 MB or smaller.')
      return
    }
    setPhoto(selected)
    setPhotoPreview(URL.createObjectURL(selected))
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview('')
    setPhotoError('')
    setConfirmation(null)
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!values.name.trim()) {
      nextErrors.name = 'Enter an item name (e.g. Casio Watch, CMF Buds).'
    }
    if (!values.category) {
      nextErrors.category = 'Choose a category.'
    } else if (values.category === 'Other') {
      if (!values.customCategory || !values.customCategory.trim()) {
        nextErrors.customCategory = 'Please specify a category.'
      } else if (values.customCategory.trim().length > 50) {
        nextErrors.customCategory = 'Specified category must be 50 characters or fewer.'
      }
    }
    if (!values.description.trim()) {
      nextErrors.description = 'Add a short description.'
    }
    if (!values.date) {
      nextErrors.date = 'Choose the date the item was lost or found.'
    } else if (values.date > today) {
      nextErrors.date = 'The date cannot be in the future.'
    }
    if (!values.locationZone) {
      nextErrors.locationZone = 'Please select a campus area.'
    }

    // Contact Information Validation
    const rawWhatsApp = values.whatsappNumber.trim()
    const rawPhone = values.contactNumber.trim()
    const rawEmail = values.emailAddress.trim()

    const hasWhatsApp = Boolean(rawWhatsApp)
    const hasPhone = Boolean(rawPhone)
    const hasEmail = Boolean(rawEmail)

    // At least one contact method must be provided
    if (!hasWhatsApp && !hasPhone && !hasEmail) {
      nextErrors.contact =
        'Please provide at least one contact method (WhatsApp, Contact Number, or Email) so others can reach you.'
    }

    // If entered, WhatsApp must be exactly 10 digits
    if (hasWhatsApp) {
      if (rawWhatsApp.length !== 10) {
        nextErrors.whatsappNumber = 'Please enter a valid 10-digit mobile number.'
      }
    }

    // If entered, Contact Number must be exactly 10 digits
    if (hasPhone) {
      if (rawPhone.length !== 10) {
        nextErrors.contactNumber = 'Please enter a valid 10-digit mobile number.'
      }
    }

    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(rawEmail)) {
        nextErrors.emailAddress = 'Enter a valid email address.'
      }
    }

    return nextErrors
  }

  const submitReport = async (event) => {
    event.preventDefault()
    if (submissionInProgressRef.current || confirmation) return

    setAttemptedSubmit(true)
    const nextErrors = validate()
    setErrors(nextErrors)
    setConfirmation(null)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0 || photoError) {
      const firstInvalidField = [
        'name',
        'category',
        'customCategory',
        'description',
        'date',
        'locationZone',
        'locationDetail',
        'whatsappNumber',
        'contactNumber',
        'emailAddress',
      ].find((field) => nextErrors[field])

      const invalidField = firstInvalidField
        ? formRef.current?.querySelector(`[name="${firstInvalidField}"]`)
        : nextErrors.contact
          ? formRef.current?.querySelector('#report-whatsapp')
          : formRef.current?.querySelector('#report-photo')
      invalidField?.focus()
      return
    }

    submissionInProgressRef.current = true
    setIsSubmitting(true)

    try {
      const formattedWhatsApp = values.whatsappNumber.trim() || null
      const formattedContact = values.contactNumber.trim() || null
      const formattedEmail = values.emailAddress.trim()
        ? values.emailAddress.trim().toLowerCase()
        : null

      const combinedLocation = values.locationDetail.trim()
        ? `${values.locationZone} - ${values.locationDetail.trim()}`
        : values.locationZone

      if (isSupabaseConfigured && supabase) {
        let photoUrl = null
        if (photo) {
          try {
            const fileExt = photo.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
            const { error: uploadError } = await supabase.storage
              .from('item-photos')
              .upload(fileName, photo)

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('item-photos')
                .getPublicUrl(fileName)
              photoUrl = publicUrlData?.publicUrl
            } else {
              console.warn('Storage upload error (continuing without image):', uploadError)
            }
          } catch (storageErr) {
            console.warn('Supabase storage exception:', storageErr)
          }
        }

        const newItem = {
          name: values.name.trim(),
          status: values.type,
          category: values.category,
          custom_category:
            values.category === 'Other' && values.customCategory.trim()
              ? values.customCategory.trim()
              : null,
          description: values.description.trim(),
          location: combinedLocation,
          reported: values.date,
          photo_url: photoUrl,
          whatsapp_number: formattedWhatsApp,
          contact_number: formattedContact,
          email_address: formattedEmail,
          contact_preference: values.contactPreference,
          verification_question:
            values.type === 'Found' && values.verificationQuestion.trim()
              ? values.verificationQuestion.trim()
              : null,
          reporter_name: currentUser?.name || null,
          user_id: currentUser?.id || null,
        }

        let createdItem = null
        const { data, error: insertError } = await supabase
          .from('items')
          .insert(newItem)
          .select()
          .single()

        if (insertError) {
          // If Supabase table columns haven't been added yet, insert core fields as fallback
          if (
            insertError.message?.includes('column') ||
            insertError.code === 'PGRST204' ||
            insertError.message?.includes('schema cache')
          ) {
            console.warn(
              'Supabase items table missing new columns. Inserting fallback. Please run supabase_schema.sql in Supabase SQL editor.',
            )
            const fallbackItem = {
              name: newItem.name,
              status: newItem.status,
              category: newItem.category,
              custom_category: newItem.custom_category,
              description: newItem.description,
              location: newItem.location,
              reported: newItem.reported,
              photo_url: newItem.photo_url,
              whatsapp_number: newItem.whatsapp_number,
              contact_number: newItem.contact_number,
              email_address: newItem.email_address,
              contact_preference: newItem.contact_preference,
            }
            const { data: retryData, error: retryError } = await supabase
              .from('items')
              .insert(fallbackItem)
              .select()
              .single()

            if (retryError) throw retryError
            createdItem = { ...retryData, ...newItem, pendingMigrationNotice: true }
          } else {
            throw insertError
          }
        } else {
          createdItem = data
        }

        // Store item ID in localStorage under campusfind_my_reports for My Reports filter
        if (createdItem?.id) {
          try {
            const stored = JSON.parse(localStorage.getItem('campusfind_my_reports') || '[]')
            if (!stored.includes(createdItem.id)) {
              stored.push(createdItem.id)
              localStorage.setItem('campusfind_my_reports', JSON.stringify(stored))
            }
          } catch (e) {
            console.warn('Failed to save to localStorage:', e)
          }
        }

        try {
          await supabase.from('reports').insert({
            item_name: newItem.name,
            type: newItem.status,
            category: newItem.category,
            location: newItem.location,
            date_reported: newItem.reported,
            review_status: 'Pending review',
            description: newItem.description,
            reporter_whatsapp: formattedWhatsApp,
            reporter_contact: formattedContact,
            reporter_email: formattedEmail,
            reporter_preference: values.contactPreference,
          })
        } catch (reportErr) {
          console.warn('Staff report creation error (non-fatal):', reportErr)
        }

        setConfirmation({
          ...createdItem,
          customCategory: createdItem.custom_category,
        })
        return
      }

      const response = await fetch(`${apiBaseUrl}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: values.type,
          name: values.name.trim(),
          category: values.category,
          description: values.description.trim(),
          date: values.date,
          location: combinedLocation,
          whatsappNumber: formattedWhatsApp,
          contactNumber: formattedContact,
          emailAddress: formattedEmail,
          contactPreference: values.contactPreference,
          verificationQuestion:
            values.type === 'Found' && values.verificationQuestion.trim()
              ? values.verificationQuestion.trim()
              : null,
          ...(values.category === 'Other' && values.customCategory.trim()
            ? { customCategory: values.customCategory.trim() }
            : {}),
        }),
      })

      let payload
      try {
        payload = await response.json()
      } catch {
        throw new Error('The CampusFind API returned an unreadable response.')
      }

      if (!response.ok) {
        if (payload?.error?.details && typeof payload.error.details === 'object') {
          const serverErrors = Object.fromEntries(
            Object.entries(payload.error.details).filter(([field]) =>
              [
                'type',
                'name',
                'category',
                'customCategory',
                'description',
                'date',
                'location',
                'whatsappNumber',
                'contactNumber',
                'emailAddress',
                'contact',
              ].includes(field),
            ),
          )
          setErrors(serverErrors)
          const firstInvalidField = [
            'name',
            'category',
            'customCategory',
            'description',
            'date',
            'location',
            'whatsappNumber',
            'contactNumber',
            'emailAddress',
          ].find((field) => serverErrors[field])
          formRef.current
            ?.querySelector(`[name="${firstInvalidField || 'name'}"]`)
            ?.focus()
        }
        throw new Error(
          payload?.error?.message ||
            `The report could not be created (HTTP ${response.status}).`,
        )
      }

      if (!payload?.item?.id) {
        throw new Error('The CampusFind API response did not confirm report creation.')
      }

      setConfirmation(payload.item)
    } catch (requestError) {
      setSubmitError(
        requestError instanceof TypeError
          ? 'Unable to reach the CampusFind API. Check that the backend is running, then try again.'
          : requestError.message,
      )
    } finally {
      submissionInProgressRef.current = false
      setIsSubmitting(false)
    }
  }

  const changeType = (event) => {
    updateValue(event)
    setErrors({})
    setAttemptedSubmit(false)
  }

  return (
    <div className="report-page">
      <section className="report-heading" aria-labelledby="report-title">
        <p className="browse-eyebrow">Campus Lost &amp; Found</p>
        <h1 id="report-title">Report an item</h1>
        <p>
          Share the item details and your preferred contact method. We protect your privacy while making it easy for the finder or owner to reach you.
        </p>
      </section>

      <div className="report-layout">
        {currentUser && (
          <div
            className="report-user-banner"
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '15px',
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <div>
              <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '500' }}>
                Reporting as verified campus student:
              </div>
              <strong style={{ color: '#166534', fontSize: '14px' }}>
                {currentUser.name || 'Student'}
              </strong>{' '}
              <span style={{ color: '#4ade80', fontSize: '13px' }}>
                ({currentUser.email})
              </span>
            </div>
          </div>
        )}

        <form
          className="report-form"
          ref={formRef}
          noValidate
          onSubmit={submitReport}
        >
          <fieldset className="report-type-fieldset">
            <legend>What would you like to report?</legend>
            <div className="report-type-options">
              {[
                { value: 'Lost', title: 'I Lost an Item', detail: 'I am looking for something I misplaced.' },
                { value: 'Found', title: 'I Found an Item', detail: 'I would like to help return something.' },
              ].map((option) => (
                <label
                  className={`report-type-option${values.type === option.value ? ' is-selected' : ''}`}
                  key={option.value}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={values.type === option.value}
                    onChange={changeType}
                  />
                  <span className="report-type-indicator" aria-hidden="true" />
                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.detail}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="report-fields-grid">
            <div className="report-field">
              <label htmlFor="report-name">
                Item Name (e.g., Casio Watch, CMF Buds, Fastrack Bag) <span aria-hidden="true">*</span>
              </label>
              <input
                id="report-name"
                name="name"
                type="text"
                value={values.name}
                onChange={updateValue}
                placeholder="e.g. Casio Watch, CMF Buds 2 Pro, Grey Backpack"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={[
                  'report-name-hint',
                  errors.name ? 'report-name-error' : '',
                ].filter(Boolean).join(' ') || undefined}
              />
              <p className="field-hint" id="report-name-hint">
                Enter the name of the object (do not enter your personal name here).
              </p>
              {errors.name && <p className="field-error" id="report-name-error">{errors.name}</p>}
            </div>

            <div className="report-field">
              <label htmlFor="report-category">Category <span aria-hidden="true">*</span></label>
              <select
                id="report-category"
                name="category"
                value={values.category}
                onChange={updateValue}
                required
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? 'report-category-error' : undefined}
              >
                <option value="">Select a category</option>
                {itemCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="field-error" id="report-category-error">{errors.category}</p>
              )}
            </div>

            {values.category === 'Other' && (
              <div className="report-field report-field-full">
                <label htmlFor="report-custom-category">
                  Specify category <span aria-hidden="true">*</span>
                </label>
                <input
                  id="report-custom-category"
                  name="customCategory"
                  type="text"
                  value={values.customCategory}
                  onChange={updateValue}
                  placeholder="e.g. Sports Equipment"
                  maxLength={50}
                  required
                  aria-invalid={Boolean(errors.customCategory)}
                  aria-describedby={[
                    'report-custom-category-hint',
                    errors.customCategory ? 'report-custom-category-error' : '',
                  ].filter(Boolean).join(' ') || undefined}
                />
                <p className="field-hint" id="report-custom-category-hint">
                  Provide a brief, descriptive category for items not covered above.
                </p>
                {errors.customCategory && (
                  <p className="field-error" id="report-custom-category-error">
                    {errors.customCategory}
                  </p>
                )}
              </div>
            )}

            <div className="report-field report-field-full">
              <label htmlFor="report-description">Description <span aria-hidden="true">*</span></label>
              <textarea
                id="report-description"
                name="description"
                value={values.description}
                onChange={updateValue}
                placeholder="Describe the item, including distinguishing marks, color, brand, or features."
                rows={4}
                maxLength={700}
                required
                aria-invalid={Boolean(errors.description)}
                aria-describedby={[
                  'report-description-hint',
                  errors.description ? 'report-description-error' : '',
                ].filter(Boolean).join(' ')}
              />
              <p className="field-hint" id="report-description-hint">
                Keep the location general. Don&apos;t include confidential security codes or passwords.
              </p>
              {values.type === 'Found' && (
                <p className="privacy-reminder">
                  For found items, hold back one unique detail so you can verify ownership when the owner reaches out.
                </p>
              )}
              {errors.description && (
                <p className="field-error" id="report-description-error">{errors.description}</p>
              )}
            </div>

            <div className="report-field">
              <label htmlFor="report-date">
                Date {values.type === 'Lost' ? 'lost' : 'found'} <span aria-hidden="true">*</span>
              </label>
              <input
                id="report-date"
                name="date"
                type="date"
                max={today}
                value={values.date}
                onChange={updateValue}
                required
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'report-date-error' : undefined}
              />
              {errors.date && <p className="field-error" id="report-date-error">{errors.date}</p>}
            </div>

            <div className="report-field">
              <label htmlFor="report-location-zone">
                Campus Area / Zone <span aria-hidden="true">*</span>
              </label>
              <select
                id="report-location-zone"
                name="locationZone"
                value={values.locationZone}
                onChange={updateValue}
                required
                aria-invalid={Boolean(errors.locationZone)}
                aria-describedby={errors.locationZone ? 'report-location-zone-error' : undefined}
              >
                <option value="">Select a campus area</option>
                {campusZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.locationZone && (
                <p className="field-error" id="report-location-zone-error">
                  {errors.locationZone}
                </p>
              )}
            </div>

            <div className="report-field">
              <label htmlFor="report-location-detail">
                Specific Spot / Landmark <span className="optional-label">(optional)</span>
              </label>
              <input
                id="report-location-detail"
                name="locationDetail"
                type="text"
                value={values.locationDetail}
                onChange={updateValue}
                placeholder="e.g. Near Nescafe, Room 204, 2nd floor stairs"
                maxLength={80}
                aria-describedby="report-location-detail-hint"
              />
              <p className="field-hint" id="report-location-detail-hint">
                Add room number, floor, or nearby landmark.
              </p>
            </div>

            {values.type === 'Found' && (
              <div className="report-field report-field-full">
                <label htmlFor="report-verification">
                  Ownership Verification Question <span className="optional-label">(recommended)</span>
                </label>
                <input
                  id="report-verification"
                  name="verificationQuestion"
                  type="text"
                  value={values.verificationQuestion}
                  onChange={updateValue}
                  placeholder="e.g. What is the lock screen wallpaper? What color is the phone pouch?"
                  maxLength={150}
                  aria-describedby="report-verification-hint"
                />
                <p className="field-hint" id="report-verification-hint">
                  Ask a question that only the genuine owner can answer before you hand over the item.
                </p>
              </div>
            )}

            <div className="report-field report-field-full">
              <label htmlFor="report-photo">Item photo <span className="optional-label">(optional)</span></label>
              <div className="photo-upload-control">
                <input
                  id="report-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectPhoto}
                  aria-describedby={`report-photo-hint${photoError ? ' report-photo-error' : ''}`}
                  aria-invalid={Boolean(photoError)}
                />
                <p className="field-hint" id="report-photo-hint">
                  JPG, PNG or WebP, up to 5 MB. Photos help other campus members identify your item quickly.
                </p>
              </div>
              {photoError && (
                <p className="field-error" id="report-photo-error" role="alert">
                  {photoError}
                </p>
              )}
              {photo && (
                <div className="photo-preview">
                  <img src={photoPreview} alt={`Preview of selected item: ${photo.name}`} />
                  <div className="photo-preview-info">
                    <strong>{photo.name}</strong>
                    <span>{(photo.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <button type="button" className="photo-remove" onClick={removePhoto}>
                    Remove photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================================================================
              Contact Information Section (Direct 10-digit Mobile Numbers)
              ================================================================ */}
          <section className="report-contact-section" aria-labelledby="contact-section-title">
            <div className="contact-section-header">
              <div className="contact-section-icon-badge">
                <ShieldCheckIcon />
              </div>
              <div>
                <h2 id="contact-section-title" className="contact-section-title">
                  Contact Information
                </h2>
                <p className="contact-section-subtitle">
                  Provide at least one contact method so people can connect with you. All fields are individually optional, but at least one is required.
                </p>
              </div>
            </div>

            {errors.contact && (
              <div className="contact-requirement-alert" role="alert">
                <span className="alert-bullet">!</span>
                <span>{errors.contact}</span>
              </div>
            )}

            <div className="contact-fields-grid">
              {/* WhatsApp Number Field - Direct 10-digit number */}
              <div className="report-field">
                <label htmlFor="report-whatsapp">
                  <WhatsAppIcon />
                  WhatsApp Number
                  <span className="optional-label">(optional)</span>
                </label>
                <input
                  id="report-whatsapp"
                  name="whatsappNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={values.whatsappNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  aria-invalid={Boolean(errors.whatsappNumber)}
                  aria-describedby={errors.whatsappNumber ? 'report-whatsapp-error' : undefined}
                />
                {errors.whatsappNumber && (
                  <p className="field-error" id="report-whatsapp-error">{errors.whatsappNumber}</p>
                )}
              </div>

              {/* Contact Phone Number Field - Direct 10-digit number */}
              <div className="report-field">
                <label htmlFor="report-contact-number">
                  <PhoneIcon />
                  Contact Number
                  <span className="optional-label">(optional)</span>
                </label>
                <input
                  id="report-contact-number"
                  name="contactNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={values.contactNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  aria-invalid={Boolean(errors.contactNumber)}
                  aria-describedby={errors.contactNumber ? 'report-contact-number-error' : undefined}
                />
                {errors.contactNumber && (
                  <p className="field-error" id="report-contact-number-error">{errors.contactNumber}</p>
                )}
              </div>

              {/* Email Address Field */}
              <div className="report-field contact-field-full">
                <label htmlFor="report-email">
                  <EmailIcon />
                  Email Address
                  <span className="optional-label">(optional)</span>
                </label>
                <input
                  id="report-email"
                  name="emailAddress"
                  type="email"
                  value={values.emailAddress}
                  onChange={updateValue}
                  placeholder="e.g. yourname@campus.edu"
                  maxLength={120}
                  aria-invalid={Boolean(errors.emailAddress)}
                  aria-describedby={errors.emailAddress ? 'report-email-error' : undefined}
                />
                {errors.emailAddress && (
                  <p className="field-error" id="report-email-error">{errors.emailAddress}</p>
                )}
              </div>

              {/* Privacy Preference Option */}
              <div className="contact-privacy-card contact-field-full">
                <label className="privacy-checkbox-label">
                  <input
                    type="checkbox"
                    name="shareWithInterestedOnly"
                    checked={values.shareWithInterestedOnly}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setValues((prev) => ({
                        ...prev,
                        shareWithInterestedOnly: checked,
                        contactPreference: checked
                          ? 'Share my contact details only with interested students.'
                          : 'Share publicly with anyone browsing.',
                      }))
                    }}
                  />
                  <span className="privacy-checkbox-custom" />
                  <span className="privacy-text-content">
                    <strong>Share my contact details only with interested students.</strong>
                    <small>
                      Prevents public spam. Contact details are never shown on public listing cards and are only revealed through an authorized verification flow.
                    </small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {attemptedSubmit && (Object.keys(errors).length > 0 || photoError) && (
            <p className="form-error-summary" role="alert">
              Please check the highlighted fields above before submitting.
            </p>
          )}

          {submitError && (
            <p className="form-error-summary" role="alert" aria-live="assertive">
              {submitError}
            </p>
          )}

          {confirmation && (
            <div className="report-confirmation" role="status" aria-live="polite">
              <div className="confirmation-title-wrap">
                <span className="confirmation-check-badge">✓</span>
                <strong>Report created successfully!</strong>
              </div>
              <p>
                Reference #{confirmation.id?.slice?.(0, 8) || confirmation.id}: Your {confirmation.status?.toLowerCase() || values.type.toLowerCase()} item is now listed in the campus database.
                {values.contactPreference && (
                  <span className="confirmation-privacy-note">
                    {' '}Your contact details are protected under your preference: &ldquo;{values.contactPreference}&rdquo;.
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="report-actions">
            {confirmation ? (
              <button
                className="button button-dark"
                type="button"
                onClick={() => (onNavigate ? onNavigate('/browse') : onCancel())}
              >
                View in Browse Items →
              </button>
            ) : (
              <button
                className="button button-dark"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting report…' : `Submit ${values.type} Item Report`}
              </button>
            )}
            <button
              className="button button-outline"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {confirmation ? 'Done' : 'Cancel'}
            </button>
          </div>
        </form>

        <aside className="report-side-note" aria-label="Privacy & safety tips">
          <span className="report-side-icon" aria-hidden="true">i</span>
          <h2>Safe Campus Exchange</h2>
          <p>
            When meeting in person to return or collect an item, always choose a well-lit, public campus area such as the student center, library lobby, or security desk.
          </p>
          <div className="report-privacy-summary-card">
            <strong>🔒 Privacy First</strong>
            <span>
              Your phone and email are never displayed on public listing cards. Interested students must verify their intent to view your contact details.
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ReportItem
