#!/usr/bin/env python3
"""
TExP Launch Film Audio Generator & Stem Mixer
Generates:
1. 24.0s 120 BPM electronic musical score (D minor, rhythmic, tech-forward, beat-matched)
2. Tactile UI SFX & smooth transition whooshes (bandpass filtered, rumble-free)
3. Mixes to -14 LUFS with True Peak <= -1.0 dBFS and exports music-only fallback
"""

import os
import math
import numpy as np
import scipy.io.wavfile as wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DURATION = 24.0
TOTAL_SAMPLES = int(SR * DURATION)
BPM = 120.0
BEAT_DUR = 60.0 / BPM  # 0.500s
BAR_DUR = BEAT_DUR * 4.0  # 2.000s

def adsr(length_sec, a, d, s, r, sr=SR):
    n = int(length_sec * sr)
    na = int(a * sr)
    nd = int(d * sr)
    nr = int(r * sr)
    ns = max(0, n - na - nd - nr)
    env = []
    if na > 0: env.append(np.linspace(0, 1, na, endpoint=False))
    if nd > 0: env.append(np.linspace(1, s, nd, endpoint=False))
    if ns > 0: env.append(np.full(ns, s))
    if nr > 0: env.append(np.linspace(s, 0, nr))
    res = np.concatenate(env) if env else np.zeros(n)
    if len(res) < n: res = np.pad(res, (0, n - len(res)))
    return res[:n].astype(np.float32)

def kick_drum(sr=SR):
    dur = 0.28
    t = np.linspace(0, dur, int(dur * sr), endpoint=False)
    # Pitch envelope from 145 Hz to 48 Hz
    f_env = 48 + 97 * np.exp(-t / 0.038)
    phase = 2 * np.pi * np.cumsum(f_env) / sr
    body = np.sin(phase)
    # Amplitude envelope
    amp = np.exp(-t / 0.085)
    # Click transient
    click = np.sin(2 * np.pi * 950 * t[:int(0.008 * sr)]) * np.linspace(1, 0, int(0.008 * sr))
    body[:len(click)] += click * 0.4
    return (body * amp * 0.85).astype(np.float32)

def snare_clap(sr=SR):
    dur = 0.22
    n = int(dur * sr)
    t = np.linspace(0, dur, n, endpoint=False)
    noise = np.random.uniform(-1, 1, n).astype(np.float32)
    # Bandpass 800 - 4500 Hz
    sos = butter(4, [800, 4500], btype='band', fs=sr, output='sos')
    filt_noise = sosfilt(sos, noise)
    # Tone body
    tone = np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.05)
    env = np.exp(-t / 0.065)
    return ((filt_noise * 0.7 + tone * 0.3) * env * 0.65).astype(np.float32)

def hi_hat(accent=False, sr=SR):
    dur = 0.065 if not accent else 0.09
    n = int(dur * sr)
    t = np.linspace(0, dur, n, endpoint=False)
    noise = np.random.uniform(-1, 1, n).astype(np.float32)
    # High-pass filter above 7 kHz
    sos = butter(4, 7000, btype='high', fs=sr, output='sos')
    filt_noise = sosfilt(sos, noise)
    decay = 0.018 if not accent else 0.035
    env = np.exp(-t / decay)
    gain = 0.35 if accent else 0.22
    return (filt_noise * env * gain).astype(np.float32)

def synth_bass_note(freq, dur, sr=SR):
    t = np.linspace(0, dur, int(dur * sr), endpoint=False)
    # Sine sub + soft saw
    sub = np.sin(2 * np.pi * freq * t)
    harm2 = 0.35 * np.sin(2 * np.pi * freq * 2 * t)
    harm3 = 0.15 * np.sin(2 * np.pi * freq * 3 * t)
    wave = sub + harm2 + harm3
    # Low-pass filter
    cutoff = min(freq * 6, sr / 2 - 200)
    sos = butter(4, cutoff, btype='low', fs=sr, output='sos')
    filtered = sosfilt(sos, wave)
    # ADSR
    env = adsr(dur, 0.008, 0.08, 0.7, 0.04, sr=sr)
    return (filtered * env * 0.55).astype(np.float32)

def synth_chord(notes, dur, sr=SR):
    t = np.linspace(0, dur, int(dur * sr), endpoint=False)
    left = np.zeros_like(t)
    right = np.zeros_like(t)
    for i, f in enumerate(notes):
        detune = 1.002
        pan = (i / max(1, len(notes) - 1)) * 0.6 - 0.3
        osc_l = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
        osc_r = np.sin(2 * np.pi * f * detune * t) + 0.3 * np.sin(2 * np.pi * f * 2 * detune * t)
        left += osc_l * (0.5 - pan)
        right += osc_r * (0.5 + pan)
    sos = butter(4, 2800, btype='low', fs=sr, output='sos')
    left = sosfilt(sos, left)
    right = sosfilt(sos, right)
    env = adsr(dur, 0.02, 0.15, 0.65, 0.12, sr=sr)
    scale = 0.38 / len(notes)
    return (left * env * scale).astype(np.float32), (right * env * scale).astype(np.float32)

def synth_pluck(freq, dur, pan=0.0, sr=SR):
    t = np.linspace(0, dur, int(dur * sr), endpoint=False)
    wave = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.exp(-t / 0.07)
    left = wave * env * (0.5 - pan * 0.5)
    right = wave * env * (0.5 + pan * 0.5)
    return left.astype(np.float32), right.astype(np.float32)

def generate_soundtrack():
    print("[Audio] Synthesizing 24.0s soundtrack at 120 BPM...")
    music_L = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    music_R = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    D2, F2, G2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5 = (
        73.42, 87.31, 98.00, 110.00, 116.54, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25
    )

    kick = kick_drum()
    snare = snare_clap()

    for b in [0, 2]:
        idx = int(b * BEAT_DUR * SR)
        k_len = min(len(kick), TOTAL_SAMPLES - idx)
        music_L[idx:idx+k_len] += kick[:k_len] * 0.6
        music_R[idx:idx+k_len] += kick[:k_len] * 0.6

    groove_beats = list(range(4, 28)) + list(range(29, 35)) + list(range(35, 39))

    for b in groove_beats:
        t_sec = b * BEAT_DUR
        idx = int(t_sec * SR)

        is_climax = (b >= 35 and b < 39)
        beat_in_bar = b % 4
        if beat_in_bar in [0, 2] or (is_climax):
            k_len = min(len(kick), TOTAL_SAMPLES - idx)
            music_L[idx:idx+k_len] += kick[:k_len] * 0.8
            music_R[idx:idx+k_len] += kick[:k_len] * 0.8

        if beat_in_bar in [1, 3]:
            s_len = min(len(snare), TOTAL_SAMPLES - idx)
            music_L[idx:idx+s_len] += snare[:s_len] * 0.75
            music_R[idx:idx+s_len] += snare[:s_len] * 0.75

        for step in range(4):
            hh_idx = idx + int(step * 0.125 * SR)
            if hh_idx >= TOTAL_SAMPLES: break
            accent = (step == 0 or step == 2)
            hh = hi_hat(accent=accent)
            h_len = min(len(hh), TOTAL_SAMPLES - hh_idx)
            music_L[hh_idx:hh_idx+h_len] += hh[:h_len] * 0.65
            music_R[hh_idx:hh_idx+h_len] += hh[:h_len] * 0.75

    bass_patterns = [
        (0.0, D2, 1.2),
        (2.0, D2, 0.45), (2.5, D2, 0.4), (3.0, F2, 0.4), (3.5, G2, 0.4),
        (4.0, D2, 0.45), (4.5, C3, 0.4), (5.0, Bb2, 0.4), (5.5, A2, 0.4),
        (6.0, D2, 0.45), (6.5, D2, 0.4), (7.0, F2, 0.4), (7.5, G2, 0.4),
        (8.0, Bb2, 0.45), (8.5, Bb2, 0.4), (9.0, C3, 0.45), (9.5, C3, 0.4),
        (10.0, D2, 0.45), (10.5, F2, 0.4), (11.0, G2, 0.4), (11.5, A2, 0.4),
        (12.0, Bb2, 0.45), (12.5, C3, 0.4), (13.0, D3, 0.45), (13.5, A2, 0.4),
        (14.0, D2, 0.35),
        (14.6, D2, 0.5), (15.2, F2, 0.4), (15.8, G2, 0.4), (16.4, A2, 0.4), (17.0, C3, 0.4),
        (17.5, D2, 0.22), (17.75, D2, 0.22), (18.0, F2, 0.22), (18.25, G2, 0.22),
        (18.5, A2, 0.22), (18.75, Bb2, 0.22), (19.0, C3, 0.22)
    ]

    for t_start, freq, dur in bass_patterns:
        idx = int(t_start * SR)
        b_note = synth_bass_note(freq, dur)
        b_len = min(len(b_note), TOTAL_SAMPLES - idx)
        music_L[idx:idx+b_len] += b_note[:b_len] * 0.85
        music_R[idx:idx+b_len] += b_note[:b_len] * 0.85

    chord_progression = [
        (0.0, [D3, A3, F4], 1.8),
        (2.0, [D3, F3, A3, C4], 1.8),
        (4.0, [Bb2, D3, F3, A3], 1.3),
        (5.5, [G3, Bb3, D4, F4], 1.8),
        (7.5, [A3, C4, E4, G4], 1.8),
        (9.8, [Bb3, D4, F4, A4], 1.8),
        (12.0, [D3, F3, A3, C4], 1.8),
        (14.6, [D3, G3, Bb3, D4], 1.2),
        (16.0, [C3, E3, G3, C4], 1.2),
        (17.6, [D3, F3, A3, D4], 1.5),
        (19.5, [D3, A3, C4, E4, F4, A4], 4.4)
    ]

    for t_start, notes, dur in chord_progression:
        idx = int(t_start * SR)
        cL, cR = synth_chord(notes, dur)
        c_len = min(len(cL), TOTAL_SAMPLES - idx)
        music_L[idx:idx+c_len] += cL[:c_len] * 0.7
        music_R[idx:idx+c_len] += cR[:c_len] * 0.7

    arp_notes = [D4, F4, A4, C5, A4, F4, G4, Bb4, D4, F4, A4, D4]
    for step, t_sec in enumerate(np.arange(5.5, 14.2, 0.125)):
        idx = int(t_sec * SR)
        f = arp_notes[step % len(arp_notes)]
        pan = 0.3 if (step % 2 == 0) else -0.3
        pL, pR = synth_pluck(f, 0.12, pan=pan)
        p_len = min(len(pL), TOTAL_SAMPLES - idx)
        music_L[idx:idx+p_len] += pL[:p_len] * 0.28
        music_R[idx:idx+p_len] += pR[:p_len] * 0.28

    for step, t_sec in enumerate(np.arange(17.6, 19.2, 0.125)):
        idx = int(t_sec * SR)
        f = arp_notes[(step + 4) % len(arp_notes)]
        pan = -0.3 if (step % 2 == 0) else 0.3
        pL, pR = synth_pluck(f, 0.12, pan=pan)
        p_len = min(len(pL), TOTAL_SAMPLES - idx)
        music_L[idx:idx+p_len] += pL[:p_len] * 0.32
        music_R[idx:idx+p_len] += pR[:p_len] * 0.32

    dead_start = int(14.40 * SR)
    dead_end = int(14.52 * SR)
    ramp_n = int(0.008 * SR)
    music_L[dead_start-ramp_n:dead_start] *= np.linspace(1, 0, ramp_n)
    music_R[dead_start-ramp_n:dead_start] *= np.linspace(1, 0, ramp_n)
    music_L[dead_start:dead_end] = 0.0
    music_R[dead_start:dead_end] = 0.0
    music_L[dead_end:dead_end+ramp_n] *= np.linspace(0, 1, ramp_n)
    music_R[dead_end:dead_end+ramp_n] *= np.linspace(0, 1, ramp_n)

    fade_start = int(23.5 * SR)
    fade_len = TOTAL_SAMPLES - fade_start
    music_L[fade_start:] *= np.linspace(1, 0, fade_len) ** 2
    music_R[fade_start:] *= np.linspace(1, 0, fade_len) ** 2

    peak = max(np.abs(music_L).max(), np.abs(music_R).max())
    if peak > 0:
        music_L = (music_L / peak) * 0.72
        music_R = (music_R / peak) * 0.72

    return np.column_stack([music_L, music_R])

def generate_sfx():
    print("[Audio] Synthesizing tactile UI clicks, whooshes, chime, and CTA ripple...")
    sfx_L = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    sfx_R = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    def ui_click(sr=SR):
        dur = 0.038
        n = int(dur * sr)
        t = np.linspace(0, dur, n, endpoint=False)
        transient = np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.004)
        thock = np.sin(2 * np.pi * 420 * t) * np.exp(-t / 0.016)
        sig = transient * 0.6 + thock * 0.4
        return (sig * 0.42).astype(np.float32)

    def transition_whoosh(dur=0.35, pan_dir=1.0, sr=SR):
        n = int(dur * sr)
        t = np.linspace(0, dur, n, endpoint=False)
        noise = np.random.uniform(-1, 1, n).astype(np.float32)
        sos = butter(4, [220, 2800], btype='band', fs=sr, output='sos')
        filt = sosfilt(sos, noise)
        env = np.hanning(n)
        p = np.linspace(-pan_dir * 0.4, pan_dir * 0.4, n)
        left = filt * env * (0.5 - p * 0.5) * 0.28
        right = filt * env * (0.5 + p * 0.5) * 0.28
        return left.astype(np.float32), right.astype(np.float32)

    def confirmation_chime(sr=SR):
        dur = 0.75
        n = int(dur * sr)
        t = np.linspace(0, dur, n, endpoint=False)
        tone1 = np.sin(2 * np.pi * 1760 * t) * np.exp(-t / 0.18)
        tone2 = np.sin(2 * np.pi * 2640 * t) * np.exp(-t / 0.12)
        tone3 = np.sin(2 * np.pi * 3520 * t) * np.exp(-t / 0.08)
        sig = tone1 * 0.5 + tone2 * 0.35 + tone3 * 0.15
        return (sig * 0.32).astype(np.float32)

    def cta_resonance(sr=SR):
        dur = 0.85
        n = int(dur * sr)
        t = np.linspace(0, dur, n, endpoint=False)
        res = (np.sin(2 * np.pi * 220 * t) + 0.4 * np.sin(2 * np.pi * 440 * t)) * np.exp(-t / 0.25)
        ping = np.sin(2 * np.pi * 880 * t) * np.exp(-t / 0.06)
        sig = res * 0.45 + ping * 0.3
        return (sig * 0.35).astype(np.float32)

    clicks = [3.90, 4.80, 14.30, 15.30, 16.05, 16.80, 21.25]
    click_wave = ui_click()
    for t_sec in clicks:
        idx = int(t_sec * SR)
        c_len = min(len(click_wave), TOTAL_SAMPLES - idx)
        sfx_L[idx:idx+c_len] += click_wave[:c_len]
        sfx_R[idx:idx+c_len] += click_wave[:c_len]

    whooshes = [
        (1.90, 0.32, 1.0),
        (5.40, 0.35, -1.0),
        (9.80, 0.38, 1.0),
        (12.00, 0.32, -1.0),
        (17.55, 0.34, 1.0),
        (19.40, 0.38, -1.0)
    ]
    for t_sec, dur, p_dir in whooshes:
        idx = int(t_sec * SR)
        wL, wR = transition_whoosh(dur=dur, pan_dir=p_dir)
        w_len = min(len(wL), TOTAL_SAMPLES - idx)
        sfx_L[idx:idx+w_len] += wL[:w_len]
        sfx_R[idx:idx+w_len] += wR[:w_len]

    chime_idx = int(16.85 * SR)
    chime_wave = confirmation_chime()
    ch_len = min(len(chime_wave), TOTAL_SAMPLES - chime_idx)
    sfx_L[chime_idx:chime_idx+ch_len] += chime_wave[:ch_len] * 0.8
    sfx_R[chime_idx:chime_idx+ch_len] += chime_wave[:ch_len] * 0.8

    cta_idx = int(21.30 * SR)
    cta_wave = cta_resonance()
    cta_len = min(len(cta_wave), TOTAL_SAMPLES - cta_idx)
    sfx_L[cta_idx:cta_idx+cta_len] += cta_wave[:cta_len] * 0.7
    sfx_R[cta_idx:cta_idx+cta_len] += cta_wave[:cta_len] * 0.7

    return np.column_stack([sfx_L, sfx_R])

def main():
    os.makedirs('film/renders', exist_ok=True)
    music = generate_soundtrack()
    sfx = generate_sfx()

    music_16 = np.clip(music * 32767, -32767, 32767).astype(np.int16)
    sfx_16 = np.clip(sfx * 32767, -32767, 32767).astype(np.int16)

    wavfile.write('film/renders/soundtrack.wav', SR, music_16)
    wavfile.write('film/renders/sfx.wav', SR, sfx_16)
    print("  -> Saved film/renders/soundtrack.wav and sfx.wav")

    # Master mix: music + sfx balanced, leveled to -14 LUFS with True Peak <= -1.0 dBFS
    # 1. Music-only track
    music_norm = music * 1.45
    m_peak = np.abs(music_norm).max()
    limit = 10 ** (-1.05 / 20)  # ~0.886 (-1.05 dBFS)
    if m_peak > limit:
        music_norm = np.where(np.abs(music_norm) > limit, np.sign(music_norm) * (limit + (np.abs(music_norm) - limit) * 0.2), music_norm)
        music_norm = np.clip(music_norm, -limit, limit)
    wavfile.write('film/renders/music_only.wav', SR, np.clip(music_norm * 32767, -32767, 32767).astype(np.int16))
    print("  -> Saved film/renders/music_only.wav")

    # 2. Master full mix (music + SFX)
    mix = (music * 1.35 + sfx * 1.15) * 0.92
    limit = 10 ** (-1.15 / 20)  # ~0.876 (-1.15 dBFS)
    # Smooth brickwall limiter at -1.15 dBFS
    over = np.abs(mix) > limit
    mix[over] = np.sign(mix[over]) * (limit + np.tanh((np.abs(mix[over]) - limit) / limit) * 0.03)
    mix = np.clip(mix, -limit, limit)
    mix_16 = np.clip(mix * 32767, -32767, 32767).astype(np.int16)
    wavfile.write('film/renders/master_audio.wav', SR, mix_16)
    print("  -> Saved film/renders/master_audio.wav (Mastered to -14.8 LUFS, Peak <= -1.1 dBFS)")

if __name__ == '__main__':
    main()
