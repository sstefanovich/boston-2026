import { useEffect, useMemo, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { PlaceActions } from '../components/PlaceActions';
import {
  CITY_IMAGES,
  HOTELS,
  MEETING_POINTS,
  RESTAURANTS,
  SIGHTS,
  TIMELINE,
  type Place,
} from '../data/content';
import {
  deleteJournalEntry,
  formatJournalUpdatedAt,
  getJournalEntries,
  journalKey,
  saveJournalEntry,
  type JournalEntries,
  type JournalScope,
} from '../utils/journalStorage';

type JournalMode = JournalScope;
type PlaceFilter = 'all' | 'hotel' | 'station' | 'restaurant' | 'sight';

const ALL_PLACES: Place[] = [...HOTELS, ...MEETING_POINTS, ...RESTAURANTS, ...SIGHTS];

export function JournalPage() {
  const [mode, setMode] = useState<JournalMode>('day');
  const [placeFilter, setPlaceFilter] = useState<PlaceFilter>('all');
  const [entries, setEntries] = useState<JournalEntries>(() => getJournalEntries());
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const stored = getJournalEntries();
    return Object.fromEntries(Object.entries(stored).map(([key, value]) => [key, value.text]));
  });
  const [selectedDayId, setSelectedDayId] = useState(() => TIMELINE[0]?.id ?? '');

  const filteredPlaces = useMemo(
    () => (placeFilter === 'all' ? ALL_PLACES : ALL_PLACES.filter((place) => place.kind === placeFilter)),
    [placeFilter]
  );

  const [selectedPlaceId, setSelectedPlaceId] = useState(() => filteredPlaces[0]?.id ?? ALL_PLACES[0]?.id ?? '');

  useEffect(() => {
    if (filteredPlaces.some((place) => place.id === selectedPlaceId)) return;
    setSelectedPlaceId(filteredPlaces[0]?.id ?? '');
  }, [filteredPlaces, selectedPlaceId]);

  const selectedDay = TIMELINE.find((day) => day.id === selectedDayId) ?? TIMELINE[0];
  const selectedPlace = ALL_PLACES.find((place) => place.id === selectedPlaceId) ?? filteredPlaces[0];
  const activeTargetId = mode === 'day' ? selectedDay?.id ?? '' : selectedPlace?.id ?? '';
  const activeKey = journalKey(mode, activeTargetId);
  const activeEntry = entries[activeKey];
  const activeDraft = drafts[activeKey] ?? activeEntry?.text ?? '';
  const savedCount = Object.keys(entries).length;
  const hasUnsavedChanges = activeDraft !== (activeEntry?.text ?? '');

  const setDraft = (value: string) => {
    setDrafts((prev) => ({ ...prev, [activeKey]: value }));
  };

  const handleSave = () => {
    if (!activeTargetId) return;
    const next = saveJournalEntry(mode, activeTargetId, activeDraft);
    setEntries(next);
  };

  const handleClear = () => {
    if (!activeTargetId) return;
    if (!window.confirm('Clear this journal note?')) return;
    const next = deleteJournalEntry(mode, activeTargetId);
    setEntries(next);
    setDrafts((prev) => ({ ...prev, [activeKey]: '' }));
  };

  return (
    <>
      <HeroBanner
        title="Trip Journal"
        subtitle="Write notes by day or by place"
        image={CITY_IMAGES.travel}
        theme="travel"
        badge={savedCount > 0 ? `${savedCount} saved` : 'New notes'}
      />

      <div className="tabs">
        <button type="button" className={`tab ${mode === 'day' ? 'active' : ''}`} onClick={() => setMode('day')}>
          By day
        </button>
        <button type="button" className={`tab ${mode === 'place' ? 'active' : ''}`} onClick={() => setMode('place')}>
          By place
        </button>
      </div>

      {mode === 'day' ? (
        <div className="tabs tabs-scroll">
          {TIMELINE.map((day) => {
            const key = journalKey('day', day.id);
            const hasNote = Boolean((drafts[key] ?? entries[key]?.text ?? '').trim());
            return (
              <button
                key={day.id}
                type="button"
                className={`tab ${selectedDayId === day.id ? 'active' : ''}`}
                onClick={() => setSelectedDayId(day.id)}
              >
                {day.weekday.slice(0, 3)} {hasNote ? '•' : ''}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="tabs tabs-scroll">
            <button type="button" className={`tab ${placeFilter === 'all' ? 'active' : ''}`} onClick={() => setPlaceFilter('all')}>
              All
            </button>
            <button type="button" className={`tab ${placeFilter === 'hotel' ? 'active' : ''}`} onClick={() => setPlaceFilter('hotel')}>
              Hotels
            </button>
            <button type="button" className={`tab ${placeFilter === 'station' ? 'active' : ''}`} onClick={() => setPlaceFilter('station')}>
              Travel
            </button>
            <button
              type="button"
              className={`tab ${placeFilter === 'restaurant' ? 'active' : ''}`}
              onClick={() => setPlaceFilter('restaurant')}
            >
              Dining
            </button>
            <button type="button" className={`tab ${placeFilter === 'sight' ? 'active' : ''}`} onClick={() => setPlaceFilter('sight')}>
              Sights
            </button>
          </div>
          <div className="card journal-picker-card">
            <label className="currency-label">
              Place
              <select className="expense-select" value={selectedPlaceId} onChange={(e) => setSelectedPlaceId(e.target.value)}>
                {filteredPlaces.map((place) => {
                  const key = journalKey('place', place.id);
                  const hasNote = Boolean((drafts[key] ?? entries[key]?.text ?? '').trim());
                  return (
                    <option key={place.id} value={place.id}>
                      {place.name}
                      {hasNote ? ' •' : ''}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </>
      )}

      <div className="card">
        {mode === 'day' && selectedDay ? (
          <>
            <span className={`badge badge-${selectedDay.theme}`}>{selectedDay.date}</span>
            <h2 className="journal-heading">{selectedDay.where}</h2>
            <p className="journal-context">{selectedDay.highlights}</p>
            {selectedDay.freeTime && <p className="journal-context journal-context-muted">Free time: {selectedDay.freeTime}</p>}
          </>
        ) : selectedPlace ? (
          <>
            <span className={`badge badge-${selectedPlace.theme}`}>{selectedPlace.city}</span>
            <h2 className="journal-heading">{selectedPlace.name}</h2>
            <p className="journal-context">{selectedPlace.address}</p>
            {selectedPlace.notes && <p className="journal-context journal-context-muted">{selectedPlace.notes}</p>}
            <PlaceActions place={selectedPlace} showCalendar={false} />
          </>
        ) : (
          <p className="page-lead">Pick a day or place to start journaling.</p>
        )}

        <div className="journal-entry-head">
          <h3>Your note</h3>
          {activeEntry ? (
            <span className="journal-updated">Saved {formatJournalUpdatedAt(activeEntry.updatedAt)}</span>
          ) : (
            <span className="journal-updated">Not saved yet</span>
          )}
        </div>

        <textarea
          className="expense-textarea journal-textarea"
          rows={9}
          placeholder={
            mode === 'day'
              ? 'Highlights, meals, weather, what you saw, what you want to remember...'
              : 'Why this place mattered, what you ordered, what to come back for, tips for next time...'
          }
          value={activeDraft}
          onChange={(e) => setDraft(e.target.value)}
        />

        <div className="journal-footer">
          <span className="journal-count">{activeDraft.trim() ? `${activeDraft.trim().split(/\s+/).length} words` : 'No text yet'}</span>
          {hasUnsavedChanges && <span className="journal-status">Unsaved changes</span>}
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save note
          </button>
          <button type="button" className="btn" onClick={handleClear} disabled={!activeDraft && !activeEntry}>
            Clear note
          </button>
        </div>
      </div>
    </>
  );
}
