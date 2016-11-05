/** 
 * AKAI MPK Mini 2 macro
 * Controller Script for Bitwig (http://bitwig.com)
 * 
 * @author: Robert Agthe (Polarity) robert@scriptshit.de (http://polarity-dnb.de)
 * @repository: https://github.com/polarity/AKAI-MPK-Mini-2-macro
 **/
loadAPI(1)

// define this controller script
// first is the controller vendor
// second just a string for a name in the bitwig menus
// third a version number
// fourth a uuid -> generate one here for every device: https://www.famkruithof.net/uuid/uuidgen
host.defineController('Akai', 'Polarity AKAI MPK Mini 2 - Macro Knobs only', '1.0', 'FC328F70-A372-11E6-BDF4-0800200C9A66')
host.defineMidiPorts(1, 0)

// position to cc mapping
// first entry = first macro knob
// second entry = second macro knob
// example:
// var macroCCMapping = [20, 21, 22, 23, 24, 25, 26, 27]
// 20 = first position = first macro knob = cc 20
// 21 = second position = second macro knob = cc 21
// ....
var macroCCMapping = [20, 21, 22, 23, 24, 25, 26, 27]

// var for holding the first
// primary insrument on the track
// (thats where the knobs are on)
var primaryInstrument

// init the script
// bitwig calls this first and once
function init () {
  host.getMidiInPort(0).createNoteInput('AKAI MPK Mini 2')
  host.getMidiInPort(0).setMidiCallback(onMidi)
  var cursorTrack = host.createCursorTrackSection(3, 0)
  primaryInstrument = cursorTrack.getPrimaryInstrument()
  for ( var i = 0; i < 8; i++) {
    var p = primaryInstrument.getMacro(i).getAmount()
    p.setIndication(true)
  }
}

// called on every midi event
function onMidi (status, data1, data2) {
  if (isChannelController(status)) {

    // find cc in mapping array and remember index
    var ccPositionInArray = macroCCMapping.indexOf(data1)

    // when cc is found in macroCCMapping array...
    if (ccPositionInArray > -1) {
      // .. then map index (0...8) to this CC
      primaryInstrument
        .getMacro(ccPositionInArray) // get the macro knob (0-8)
        .getAmount() // get the current value of the knob
        .set(data2, 128) // set the knob to a new value (data2)
    }
  }
}
