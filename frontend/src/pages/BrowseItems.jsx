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

function ItemCard({ item, onSelect }) {
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
          <span
            className={`item-status-badge ${isLost ? 'item-status-lost' : 'item-status-found'}`}
          >
            <span className="item-status-dot" aria-hidden="true" />
            {isLost ? 'LOST' : 'FOUND'}
          </span>
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

function ItemDetailsDialog({ item, onClose }) {
  const dialogRef = useRef(null)
  const [contactRevealed, setContactRevealed] = useState(false)
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
    setContactRevealed(false)
    setContactDetails(null)
    setContactError('')
  }, [item])

  const handleRevealContact = async () => {
    if (!item) return
    setLoadingContact(true)
    setContactError('')

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('items')
          .select('whatsapp_number, contact_number, email_address, contact_preference')
          .eq('id', item.id)
          .single()

        if (error) throw error
        setContactDetails(data || {})
        setContactRevealed(true)
      } else {
        const response = await fetch(`${apiBaseUrl}/api/items/${item.id}/contact`)
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Could not retrieve contact information.')
        }
        setContactDetails(payload.contact || {})
        setContactRevealed(true)
      }
    } catch (err) {
      console.error('Failed to load contact info:', err)
      setContactError(err.message || 'Unable to retrieve contact details.')
    } finally {
      setLoadingContact(false)
    }
  }

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

          {/* ================================================================
              Authorized Contact Information Flow
              ================================================================ */}
          <section className="item-dialog-contact-section" aria-label="Contact Reporter">
            <div className="contact-box-header">
              <span className="contact-privacy-shield" aria-hidden="true">🛡️</span>
              <div>
                <h3>Connect with Reporter</h3>
                <p>
                  {item.contact_preference ||
                    'Protected: Shared only with interested campus students.'}
                </p>
              </div>
            </div>

            {!contactRevealed ? (
              <div className="contact-reveal-prompt">
                <p>
                  {isLost
                    ? 'Found this item? Reach out to the owner to arrange a safe return on campus.'
                    : 'Recognize this item as yours? Contact the finder to verify ownership and claim it.'}
                </p>
                <button
                  type="button"
                  className="button button-contact-reveal"
                  onClick={handleRevealContact}
                  disabled={loadingContact}
                >
                  {loadingContact ? 'Accessing secure details…' : 'Reveal Contact Details'}
                </button>
                {contactError && <p className="contact-reveal-error">{contactError}</p>}
              </div>
            ) : (
              <div className="contact-revealed-list">
                {contactDetails?.whatsapp_number && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon whatsapp-icon-bg">
                        <WhatsAppIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">WhatsApp</span>
                        <strong className="contact-method-value">
                          {contactDetails.whatsapp_number}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${contactDetails.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
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

                {contactDetails?.contact_number && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon phone-icon-bg">
                        <PhoneIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">Phone Call</span>
                        <strong className="contact-method-value">
                          {contactDetails.contact_number}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`tel:${contactDetails.contact_number.replace(/\s+/g, '')}`}
                      className="contact-action-btn phone-action"
                    >
                      Call
                    </a>
                  </div>
                )}

                {contactDetails?.email_address && (
                  <div className="contact-method-row">
                    <div className="contact-method-info">
                      <span className="contact-method-icon email-icon-bg">
                        <EmailIcon />
                      </span>
                      <div>
                        <span className="contact-method-label">Email</span>
                        <strong className="contact-method-value">
                          {contactDetails.email_address}
                        </strong>
                      </div>
                    </div>
                    <a
                      href={`mailto:${contactDetails.email_address}?subject=${encodeURIComponent(
                        `CampusFind: Regarding your ${item.status} item "${item.name}"`,
                      )}`}
                      className="contact-action-btn email-action"
                    >
                      Send Email
                    </a>
                  </div>
                )}

                {!contactDetails?.whatsapp_number &&
                  !contactDetails?.contact_number &&
                  !contactDetails?.email_address && (
                    <p className="no-direct-contact-note">
                      No direct contact method was recorded for this listing. Please contact the campus lost &amp; found desk or authorized staff.
                    </p>
                  )}
              </div>
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

function BrowseItems() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest'
  const [items, setItems] = useState([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const availableCategoriesRef = useRef(null)

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
          // Privacy: Select only public listing fields (omit whatsapp_number, contact_number, email_address)
          let query = supabase
            .from('items')
            .select('id, name, status, category, custom_category, description, location, reported, photo_url, contact_preference')
          if (status !== 'All') query = query.eq('status', status)
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
      if (status !== 'All') query.set('status', status)
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

  // Filter by search (name, description, category, location) and apply sort
  const filteredAndSortedItems = items
    .filter((item) => {
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
              <option value="All">All Items</option>
              <option value="Lost">Lost Only</option>
              <option value="Found">Found Only</option>
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
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="browse-empty-state" role="status" aria-live="polite">
            <span className="empty-search-icon"><SearchIcon /></span>
            <h3>No matching items found</h3>
            <p>
              Try adjusting your search query, or clear your filters to explore all community listings.
            </p>
            <button
              className="button button-dark"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}

export default BrowseItems
