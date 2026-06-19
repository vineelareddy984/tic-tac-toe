package com.aistudio.tictactoe.utils

import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import kotlin.math.sin

object SoundManager {
    var isMuted = false

    private fun playTone(frequency: Double, durationMs: Int, waveType: String = "sine") {
        if (isMuted) return
        Thread {
            try {
                val sampleRate = 44100
                val numSamples = (sampleRate * (durationMs / 1000.0)).toInt()
                val samples = DoubleArray(numSamples)
                val buffer = ShortArray(numSamples)

                for (i in 0 until numSamples) {
                    val t = i.toDouble() / sampleRate
                    samples[i] = when (waveType) {
                        "triangle" -> {
                            val period = 1.0 / frequency
                            val pos = (t % period) / period
                            if (pos < 0.25) 4.0 * pos
                            else if (pos < 0.75) 2.0 - 4.0 * pos
                            else 4.0 * pos - 4.0
                        }
                        else -> sin(2.0 * Math.PI * frequency * t)
                    }
                    
                    val fadeOutSamples = sampleRate * 0.05
                    val envelope = if (i > numSamples - fadeOutSamples) {
                        (numSamples - i) / fadeOutSamples
                    } else if (i < sampleRate * 0.01) {
                        i / (sampleRate * 0.01)
                    } else {
                        1.0
                    }
                    
                    buffer[i] = (samples[i] * 32767.0 * 0.15 * envelope).toInt().toShort()
                }

                val minBufferSize = AudioTrack.getMinBufferSize(
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
                )
                
                @Suppress("DEPRECATION")
                val audioTrack = AudioTrack(
                    AudioManager.STREAM_MUSIC,
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    maxOf(minBufferSize, buffer.size * 2),
                    AudioTrack.MODE_STATIC
                )

                audioTrack.write(buffer, 0, buffer.size)
                audioTrack.play()
                
                Thread.sleep(durationMs.toLong() + 20)
                audioTrack.stop()
                audioTrack.release()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    fun playClick() {
        playTone(600.0, 50, "sine")
    }

    fun playMoveX() {
        playTone(550.0, 100, "triangle")
    }

    fun playMoveO() {
        playTone(330.0, 100, "sine")
    }

    fun playWin() {
        Thread {
            try {
                playTone(261.63, 120, "triangle")
                Thread.sleep(80)
                playTone(329.63, 120, "triangle")
                Thread.sleep(80)
                playTone(523.25, 300, "sine")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    fun playDraw() {
        Thread {
            try {
                playTone(293.66, 180, "sine")
                Thread.sleep(120)
                playTone(220.00, 300, "sine")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }
}
