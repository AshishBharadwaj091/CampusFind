import { useEffect, useRef, useState } from 'react'
import { apiBaseUrl } from '../config/api.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { itemCategories } from '../data/mockItems.js'
import './BrowseItems.css'

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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

function ItemIllustration({ type }) {
  const common = {
    'aria-hidden': true,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  switch (type) {
    case 'card':
      return (
        <svg {...common}>
          <rect x="8" y="12" width="32" height="24" rx="4" />
          <path d="M8 19h32M14 27h9M14 31h14" />
        </svg>
      )
    case 'wallet':
      return (
        <svg {...common}>
          <rect x="8" y="12" width="32" height="25" rx="4" />
          <path d="M8 19h32M31 27h.1M13 12V9h22v3" />
        </svg>
      )
    case 'keys':
      return (
        <svg {...common}>
          <circle cx="17" cy="20" r="7" />
          <path d="m22 25 13 13m-5-5 4-4m-8 0 4-4" />
          <circle cx="17" cy="20" r="2" />
        </svg>
      )
    case 'headphones':
      return (
        <svg {...common}>
          <path d="M9 26v-5a15 15 0 0 1 30 0v5" />
          <rect x="7" y="24" width="8" height="14" rx="3" />
          <rect x="33" y="24" width="8" height="14" rx="3" />
          <path d="M15 36a4 4 0 0 0 4 4h7" />
        </svg>
      )
    case 'bottle':
      return (
        <svg {...common}>
          <path d="M19 10h10v5l3 4v17a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V19l3-4v-5Z" />
          <path d="M19 15h10M17 28h14" />
        </svg>
      )
    case 'notebook':
      return (
        <svg {...common}>
          <rect x="13" y="8" width="25" height="32" rx="3" />
          <path d="M19 8v32M8 14h5M8 21h5M8 28h5M8 35h5M24 17h8M24 23h8" />
        </svg>
      )
    case 'charger':
      return (
        <svg {...common}>
          <rect x="12" y="14" width="21" height="19" rx="4" />
          <path d="M18 14V9m9 5V9M18 25h9M22 21l-3 4h4l-2 4" />
          <path d="M33 24h4a4 4 0 0 1 4 4v5" />
        </svg>
      )
    case 'bag':
      return (
        <svg {...common}>
          <path d="M12 18h24l3 21H9l3-21Z" />
          <path d="M18 18v-4a6 6 0 0 1 12 0v4M18 25v.1M30 25v.1" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M24 7v34M10 15l28 18M38 15 10 33" />
          <circle cx="24" cy="24" r="17" />
        </svg>
      )
  }
}

function formatItemDate(dateStr) {
  if (!dateStr) return ''
  try {
    const isIsoDate = /^\d{4}-\d{2}-\d{2}/.test(dateStr)
    const dateObj = isIsoDate ? new Date(dateStr.length === 10 ? `${dateStr}T00:00:00Z` : dateStr) : new Date(dateStr)
    if (isNaN(dateObj.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj)
  } catch {
    return dateStr
  }
}

function ItemCard({ item, onSelect, isMyItem }) {
  const visualByCategory = {
    'Cards & Wallets': 'wallet',
    'Bags & Personal Items': 'bag',
    'Books & Stationery': 'notebook',
    Electronics: (item.name || '').toLowerCase().includes('headphone')
      ? 'headphones'
      : 'charger',
    Keys: 'keys',
    Other: 'bottle',
  }
  const visual = item.visual || visualByCategory[item.category] || 'default'
  const formattedDate = formatItemDate(item.reported)
  const isLost = (item.status || '').toLowerCase() === 'lost'
  const isResolved = Boolean(item.is_resolved)

  return (
    <article
      className="browse-item-card"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item)
        }
      }}
      aria-label={`View details for ${item.name}, ${item.status}, ${item.customCategory ? `Other (${item.customCategory})` : item.category}`}
    >
      <div className="item-card-media-wrapper">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.name}
            className="item-card-image"
            loading="lazy"
          />
        ) : (
          <div className={`item-card-placeholder item-placeholder-${visual}`}>
            <div className="placeholder-icon-wrap">
              <ItemIllustration type={visual} />
            </div>
            <span className="placeholder-caption">No photo provided</span>
          </div>
        )}

        {/* Prominent Distinguishable Status Badge */}
        <div className="item-card-overlay-top">
          {isResolved ? (
            <span className="item-status-badge item-status-resolved">
              <span className="item-status-dot" aria-hidden="true" />
              RESOLVED
            </span>
          ) : (
            <span
              className={`item-status-badge ${isLost ? 'item-status-lost' : 'item-status-found'}`}
            >
              <span className="item-status-dot" aria-hidden="true" />
              {isLost ? 'LOST' : 'FOUND'}
            </span>
          )}
          {isMyItem && (
            <span className="item-my-report-chip" title="You reported this item">
              My Post
            </span>
          )}
          {formattedDate && (
            <span className="item-card-date-chip">
              <CalendarIcon />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      <div className="item-card-content">
        <div className="item-card-header">
          <span className="item-category-pill">
            {item.customCategory ? `Other (${item.customCategory})` : item.category}
          </span>
        </div>

        <h3 className="item-card-title" title={item.name}>
          {item.name}
        </h3>

        <p className="item-card-description" title={item.description}>
          {item.description || 'No additional description provided.'}
        </p>

        <div className="item-card-meta">
          <div className="item-meta-item" title={`Location: ${item.location || 'Campus'}`}>
            <LocationIcon />
            <span className="item-meta-text">{item.location || 'Campus'}</span>
          </div>
        </div>

        <div className="item-card-action">
          <span className="item-view-btn">
            View Details
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </article>
  )
}

function ItemDetailsDialog({ item, onClose, isMyItem, onResolveItem, onDeleteItem }) {
  const dialogRef = useRef(null)
  const [loadingContact, setLoadingContact] = useState(false)
  const [contactDetails, setContactDetails] = useState(null)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (item && dialog && !dialog.open) {
      dialog.showModal()
    } else if (!item && dialog?.open) {
      dialog.close()
    }
  }, [item])

  useEffect(() => {
    let isCurrent = true
    if (!item?.id) {
      setContactDetails(null)
      setContactError('')
      return
    }

    // Immediately populate with item's contact info if already available
    setContactDetails({
      whatsapp_number: item.whatsapp_number || null,
      contact_number: item.contact_number || null,
      email_address: item.email_address || null,
      contact_preference:
        item.contact_preference ||
        'Share my contact details only with interested students.',
    })

    // Fetch fresh contact details directly from Supabase
    const fetchContactDetails = async () => {
      setLoadingContact(true)
      setContactError('')
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('items')
            .select('whatsapp_number, contact_number, email_address, contact_preference')
            .eq('id', item.id)
            .single()

          if (!error && data && isCurrent) {
            setContactDetails((prev) => ({ ...prev, ...data }))
          }
        } else {
          const response = await fetch(`${apiBaseUrl}/api/items/${item.id}/contact`)
          const payload = await response.json()
          if (response.ok && payload.contact && isCurrent) {
            setContactDetails((prev) => ({
              ...prev,
              whatsapp_number:
                payload.contact.whatsappNumber ||
                payload.contact.whatsapp_number ||
                prev?.whatsapp_number,
              contact_number:
                payload.contact.contactNumber ||
                payload.contact.contact_number ||
                prev?.contact_number,
              email_address:
                payload.contact.emailAddress ||
                payload.contact.email_address ||
                prev?.email_address,
              contact_preference:
                payload.contact.contactPreference ||
                payload.contact.contact_preference ||
                prev?.contact_preference,
            }))
          }
        }
      } catch (err) {
        console.warn('Could not refresh contact details:', err)
      } finally {
        if (isCurrent) setLoadingContact(false)
      }
    }

    fetchContactDetails()

    return () => {
      isCurrent = false
    }
  }, [item])

  const effectiveWhatsApp = (
    contactDetails?.whatsapp_number ||
    item?.whatsapp_number ||
    ''
  ).trim()
  const effectivePhone = (
    contactDetails?.contact_number ||
    item?.contact_number ||
    ''
  ).trim()
  const effectiveEmail = (
    contactDetails?.email_address ||
    item?.email_address ||
    ''
  ).trim()
  const effectivePreference =
    contactDetails?.contact_preference ||
    item?.contact_preference ||
    'Share my contact details only with interested students.'

  const hasWhatsApp = Boolean(effectiveWhatsApp)
  const hasPhone = Boolean(effectivePhone)
  const hasEmail = Boolean(effectiveEmail)
  const hasAnyContact = hasWhatsApp || hasPhone || hasEmail

  // Reporter has enabled sharing unless preference explicitly states 'do not share' or 'private'
  const isSharingEnabled =
    !effectivePreference.toLowerCase().includes('do not share') &&
    !effectivePreference.toLowerCase().includes('private') &&
    effectivePreference.toLowerCase() !== 'none'

  const isLost = item ? (item.status || '').toLowerCase() === 'lost' : false
  const formattedDate = item ? formatItemDate(item.reported) : ''

  return (
    <dialog
      className="item-details-dialog"
      ref={dialogRef}
      aria-labelledby="item-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {item && (
        <div className="item-dialog-content">
          <div className="item-dialog-heading">
            <div>
              <p className="browse-eyebrow">Campus Lost &amp; Found Listing</p>
              <h2 id="item-dialog-title">{item.name}</h2>
            </div>
            <button
              className="item-dialog-close"
              type="button"
              aria-label="Close item details"
              onClick={onClose}
              autoFocus
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {item.photo_url && (
            <div className="item-dialog-photo-wrap">
              <img
                src={item.photo_url}
                alt={item.name}
                className="item-dialog-photo"
              />
            </div>
          )}

          <div className="item-dialog-summary">
            <span
              className={`item-status-badge ${isLost ? 'item-status-lost' : 'item-status-found'}`}
            >
              <span className="item-status-dot" aria-hidden="true" />
              {isLost ? 'LOST' : 'FOUND'}
            </span>
            <span className="item-category-pill">
              {item.customCategory ? `Other (${item.customCategory})` : item.category}
            </span>
          </div>

          <p className="item-dialog-description">{item.description}</p>

          <dl className="item-dialog-meta">
            {item.customCategory && (
              <div>
                <dt>Custom Category</dt>
                <dd>{item.customCategory}</dd>
              </div>
            )}
            <div>
              <dt>Location</dt>
              <dd>{item.location || 'Campus'}</dd>
            </div>
            <div>
              <dt>Reported Date</dt>
              <dd>{formattedDate || item.reported || 'Recently'}</dd>
            </div>
          </dl>

          {/* Ownership Verification Question for Found items */}
          {item.status === 'Found' && item.verification_question && (
            <div className="item-dialog-verification-box">
              <div className="verification-box-header">
                <span aria-hidden="true">🔐</span>
                <strong>Finder&apos;s Ownership Verification</strong>
              </div>
              <p className="verification-box-desc">
                The finder asked this question to verify genuine ownership before handover:
              </p>
              <blockquote className="verification-box-quote">
                &ldquo;{item.verification_question}&rdquo;
              </blockquote>
            </div>
          )}

          {/* User's Own Post Controls (Resolve / Returned & Delete) */}
          {isMyItem && (
            <div className="item-dialog-owner-panel">
              <div className="owner-panel-header">
                <span aria-hidden="true">👤</span>
                <strong>Your Listing Controls</strong>
              </div>
              <div className="owner-panel-actions">
                {!item.is_resolved ? (
                  <button
                    type="button"
                    className="button-owner-resolve"
                    onClick={() => onResolveItem(item.id)}
                  >
                    ✓ Mark as Returned / Resolved
                  </button>
                ) : (
                  <span className="owner-resolved-badge">
                    ✓ Marked as Returned / Resolved
                  </span>
                )}
                <button
                  type="button"
                  className="button-owner-delete"
                  onClick={() => onDeleteItem(item.id)}
                >
                  🗑 Delete Report
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              Authorized Contact Information Flow
              ================================================================ */}
          <section className="item-dialog-contact-section" aria-label="Contact Reporter">
            <div className="contact-box-header">
              <span className="contact-privacy-shield" aria-hidden="true">🛡️</span>
              <div>
                <h3>Connect with Reporter</h3>
                <p>
                  {isSharingEnabled
                    ? (effectivePreference || 'Direct contact details provided by the reporter.')
                    : 'Contact details kept private per reporter preference.'}
                </p>
              </div>
            </div>

            {!isSharingEnabled ? (
              <div className="contact-private-note">
                <p>
                  The reporter has chosen to keep their direct contact details private. Please contact campus security or the lost &amp; found desk to connect.
                </p>
              </div>
            ) : hasAnyContact ? (
              <div className="contact-revealed-list">
                {/* Contact Phone Number */}
                {hasPhone && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon phone-icon-bg">
                        <PhoneIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">Contact Number</span>
                        <strong className="contact-method-value">
                          {effectivePhone}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`tel:${effectivePhone.replace(/\s+/g, '')}`}
                      className="contact-action-btn phone-action"
                    >
                      Call Now
                    </a>
                  </div>
                )}

                {/* WhatsApp Number */}
                {hasWhatsApp && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon whatsapp-icon-bg">
                        <WhatsAppIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">WhatsApp</span>
                        <strong className="contact-method-value">
                          {effectiveWhatsApp}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${
                        effectiveWhatsApp.replace(/\D/g, '').length === 10
                          ? `91${effectiveWhatsApp.replace(/\D/g, '')}`
                          : effectiveWhatsApp.replace(/\D/g, '')
                      }?text=${encodeURIComponent(
                        `Hi, I am contacting you regarding your ${item.status} item "${item.name}" on CampusFind.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-action-btn whatsapp-action"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                )}

                {/* Email Address */}
                {hasEmail && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon email-icon-bg">
                        <EmailIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">Email Address</span>
                        <strong className="contact-method-value">
                          {effectiveEmail}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`mailto:${effectiveEmail}?subject=${encodeURIComponent(
                        `CampusFind: Regarding your ${item.status} item "${item.name}"`,
                      )}`}
                      className="contact-action-btn email-action"
                    >
                      Send Email
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-direct-contact-note">
                No direct contact method was recorded for this listing. Please contact the campus lost &amp; found desk or authorized staff.
              </p>
            )}
          </section>

          <p className="item-dialog-note">
            Please meet in public campus areas (library, student center or cafeteria) when exchanging belongings.
          </p>
        </div>
      )}
    </dialog>
  )
}

function BrowseItems({ currentUser, onNavigate, currentPath }) {
  const urlCategory =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('category') || 'All'
      : 'All'
  const urlStatus =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('status') || 'All'
      : 'All'

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(urlStatus)
  const [category, setCategory] = useState(urlCategory)
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest'
  const [items, setItems] = useState([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const availableCategoriesRef = useRef(null)

  // Synchronize category, status, and deep-linked item modal with URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlCat = params.get('category')
    const urlSt = params.get('status')
    const urlIt = params.get('item')

    if (urlCat) {
      setCategory(urlCat)
    }
    if (urlSt) {
      setStatus(urlSt)
    }
    if (urlIt) {
      const match = items.find((i) => String(i.id) === String(urlIt))
      if (match) {
        setSelectedItem(match)
      } else if (isSupabaseConfigured && supabase) {
        supabase
          .from('items')
          .select(
            'id, name, status, category, custom_category, description, location, reported, photo_url, contact_preference, verification_question, is_dismissed, is_resolved, whatsapp_number, contact_number, email_address, user_id',
          )
          .eq('id', urlIt)
          .single()
          .then(({ data, error: itemError }) => {
            if (!itemError && data && !data.is_dismissed) {
              setSelectedItem({
                ...data,
                customCategory: data.custom_category || data.customCategory,
              })
            }
          })
          .catch((err) => console.warn('Could not fetch deep-linked item:', err))
      }
    }
  }, [currentPath, items])

  const [myReportIds, setMyReportIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campusfind_my_reports') || '[]')
    } catch {
      return []
    }
  })

  const isMyReport = (item) => {
    if (!item) return false
    if (myReportIds.includes(item.id)) return true
    if (
      currentUser?.email &&
      item.email_address &&
      item.email_address.toLowerCase() === currentUser.email.toLowerCase()
    ) {
      return true
    }
    if (currentUser?.id && item.user_id && item.user_id === currentUser.id) {
      return true
    }
    return false
  }

  const handleResolveItem = async (itemId) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('items').update({ is_resolved: true }).eq('id', itemId)
      }
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, is_resolved: true } : it)),
      )
      setSelectedItem((prev) =>
        prev && prev.id === itemId ? { ...prev, is_resolved: true } : prev,
      )
    } catch (err) {
      console.error('Failed to resolve item:', err)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      return
    }
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('items').delete().eq('id', itemId)
      }
      setItems((prev) => prev.filter((it) => it.id !== itemId))
      setSelectedItem(null)
      const updated = myReportIds.filter((id) => id !== itemId)
      setMyReportIds(updated)
      try {
        localStorage.setItem('campusfind_my_reports', JSON.stringify(updated))
      } catch {}
    } catch (err) {
      console.error('Failed to delete report:', err)
    }
  }

  useEffect(() => {
    let isCurrentRequest = true
    const controller = new AbortController()

    if (
      category !== 'All' &&
      availableCategoriesRef.current &&
      !availableCategoriesRef.current.includes(category)
    ) {
      setItems([])
      setError('')
      setLoading(false)
      return () => {
        isCurrentRequest = false
        controller.abort()
      }
    }

    const loadItems = async () => {
      setLoading(true)
      setError('')

      if (isSupabaseConfigured && supabase) {
        try {
          // Exclude dismissed items completely from public view
          let query = supabase
            .from('items')
            .select(
              'id, name, status, category, custom_category, description, location, reported, photo_url, contact_preference, verification_question, is_dismissed, is_resolved, whatsapp_number, contact_number, email_address, user_id',
            )
            .neq('is_dismissed', true)

          if (status === 'Lost') query = query.eq('status', 'Lost')
          if (status === 'Found') query = query.eq('status', 'Found')
          if (category !== 'All') query = query.eq('category', category)
          query = query.order('reported', { ascending: sortBy === 'oldest' })

          const { data, error: sbError } = await query
          if (sbError) throw sbError

          if (isCurrentRequest) {
            const formatted = (data || []).map((item) => ({
              ...item,
              customCategory: item.custom_category || item.customCategory,
            }))
            setItems(formatted)
            if (status === 'All' && category === 'All') {
              availableCategoriesRef.current = [
                ...new Set(formatted.map((item) => item.category)),
              ]
              setCategoriesLoaded(true)
            }
          }
          return
        } catch (sbErr) {
          if (!isCurrentRequest) return
          console.error('Supabase fetch error:', sbErr)
          setError(sbErr.message || 'Error loading items from Supabase.')
          return
        } finally {
          if (isCurrentRequest) setLoading(false)
        }
      }

      const query = new URLSearchParams()
      if (status !== 'All' && status !== 'MyReports' && status !== 'Resolved') {
        query.set('status', status)
      }
      if (category !== 'All') query.set('category', category)
      const queryString = query.toString()

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/items${queryString ? `?${queryString}` : ''}`,
          { signal: controller.signal },
        )
        let payload
        try {
          payload = await response.json()
        } catch {
          throw new Error('The CampusFind API returned an unreadable response.')
        }

        if (!response.ok) {
          throw new Error(
            payload?.error?.message ||
              `The CampusFind API returned an error (HTTP ${response.status}).`,
          )
        }
        if (payload?.status !== 'ok' || !Array.isArray(payload.items)) {
          throw new Error('The CampusFind API response did not contain a valid item list.')
        }

        if (isCurrentRequest) {
          setItems(payload.items)
          if (status === 'All' && category === 'All') {
            availableCategoriesRef.current = [
              ...new Set(payload.items.map((item) => item.category)),
            ]
            setCategoriesLoaded(true)
          }
        }
      } catch (requestError) {
        if (!isCurrentRequest || requestError.name === 'AbortError') return
        setItems([])
        setError(
          requestError instanceof TypeError
            ? 'Unable to reach the CampusFind API. Check that the backend is running, then try again.'
            : requestError.message,
        )
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }

    loadItems()
    return () => {
      isCurrentRequest = false
      controller.abort()
    }
  }, [category, retryCount, status, sortBy])

  // Filter by search, status, and sort
  const filteredAndSortedItems = items
    .filter((item) => {
      // Exclude dismissed items
      if (item.is_dismissed) return false

      // Status filters
      if (status === 'Lost' && (item.status || '').toLowerCase() !== 'lost') return false
      if (status === 'Found' && (item.status || '').toLowerCase() !== 'found') return false
      if (status === 'Resolved' && !item.is_resolved) return false
      if (status === 'MyReports' && !isMyReport(item)) return false
      if (status === 'All' && item.is_resolved) return false

      if (category !== 'All' && item.category !== category) return false

      const searchText = search.trim().toLocaleLowerCase()
      if (!searchText) return true

      const searchableText = [
        item.name || '',
        item.description || '',
        item.category || '',
        item.customCategory || '',
        item.location || '',
      ]
        .join(' ')
        .toLocaleLowerCase()

      return searchableText.includes(searchText)
    })
    .sort((a, b) => {
      const timeA = new Date(a.reported || 0).getTime()
      const timeB = new Date(b.reported || 0).getTime()
      return sortBy === 'oldest' ? timeA - timeB : timeB - timeA
    })

  const clearFilters = () => {
    setSearch('')
    setStatus('All')
    setCategory('All')
    setSortBy('newest')
  }

  const isFiltered = search !== '' || status !== 'All' || category !== 'All' || sortBy !== 'newest'

  return (
    <div className="browse-page">
      <section className="browse-heading" aria-labelledby="browse-title">
        <p className="browse-eyebrow">Campus Lost &amp; Found</p>
        <h1 id="browse-title">Find what you&apos;ve lost.</h1>
        <p className="browse-intro">
          Explore items reported by the campus community and help belongings find their way home.
        </p>
        <p className="browse-demo-note">
          <span aria-hidden="true">✓</span>
          Live campus community listings
        </p>
      </section>

      <section className="browse-controls" aria-label="Search, filter, and sort listings">
        <div className="browse-search">
          <label className="visually-hidden" htmlFor="item-search">
            Search by item name, description or location
          </label>
          <SearchIcon />
          <input
            id="item-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search items by name, description, category, or location..."
          />
          {search && (
            <button
              className="search-clear"
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        <div className="browse-filter-row">
          <div className="browse-filter">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={status}
              disabled={loading && !categoriesLoaded}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="All">All Active Items</option>
              <option value="Lost">Lost Only</option>
              <option value="Found">Found Only</option>
              <option value="MyReports">
                My Reports ({items.filter(isMyReport).length})
              </option>
              <option value="Resolved">Resolved / Returned</option>
            </select>
          </div>

          <div className="browse-filter">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={category}
              disabled={loading && !categoriesLoaded}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All Categories</option>
              {itemCategories.map((itemCategory) => (
                <option key={itemCategory} value={itemCategory}>
                  {itemCategory}
                </option>
              ))}
            </select>
          </div>

          <div className="browse-filter">
            <label htmlFor="sort-filter">Sort By</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button
            className="clear-filters"
            type="button"
            onClick={clearFilters}
            disabled={!isFiltered}
          >
            Clear filters
          </button>
        </div>
      </section>

      <section className="browse-results" aria-labelledby="results-heading">
        <div className="browse-results-heading">
          <h2 id="results-heading">Campus listings</h2>
          <p aria-live="polite">
            {loading
              ? 'Loading campus items…'
              : `Showing ${filteredAndSortedItems.length} ${filteredAndSortedItems.length === 1 ? 'item' : 'items'}`}
          </p>
        </div>

        {loading ? (
          <div className="browse-loading-state" role="status" aria-live="polite">
            <span className="browse-loading-indicator" aria-hidden="true" />
            <p>Loading campus listings…</p>
          </div>
        ) : error ? (
          <div className="browse-error-state" role="alert">
            <span className="browse-error-mark" aria-hidden="true">!</span>
            <h3>Listings couldn&apos;t be loaded</h3>
            <p>{error}</p>
            <button
              className="button button-dark"
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </button>
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
          <div className="browse-item-grid">
            {filteredAndSortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isMyItem={isMyReport(item)}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="browse-empty-state" role="status" aria-live="polite">
            <span className="empty-search-icon"><SearchIcon /></span>
            <h3>
              {status === 'MyReports'
                ? 'No reports found for your account'
                : 'No matching items found'}
            </h3>
            <p>
              {status === 'MyReports'
                ? 'You have not reported any items yet, or all your reports have been completed.'
                : 'Try adjusting your search query, or clear your filters to explore all community listings.'}
            </p>
            {status === 'MyReports' && onNavigate ? (
              <button
                className="button button-dark"
                type="button"
                onClick={() => onNavigate('/report')}
              >
                Report an Item Now
              </button>
            ) : (
              <button
                className="button button-dark"
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      <ItemDetailsDialog
        item={selectedItem}
        isMyItem={isMyReport(selectedItem)}
        onResolveItem={handleResolveItem}
        onDeleteItem={handleDeleteItem}
        onClose={() => {
          setSelectedItem(null)
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            if (params.has('item')) {
              params.delete('item')
              const searchStr = params.toString() ? `?${params.toString()}` : ''
              window.history.replaceState({}, '', `${window.location.pathname}${searchStr}`)
            }
          }
        }}
      />
    </div>
  )
}

export default BrowseItems
