# divekit-report-visualizer

Der `divekit-report-visualizer` erstellt auf Basis einer xml-Datei ([Beispiel](assets/xml-examples/unified.xml)), eine
Website, welche die Inhalte bzw. den Bericht visuell aufbereitet und bspw. über GitHub/Lab-Pages zur Verfügung gestellt
werden kann.

## Nutzung

* Mit `node bin/report-visualizer` lässt sich die Visualisierung lokal ausführen. Dazu sollte vorher die vom
  Report-Mapper generierte Datei `unified.xml` im `target` Ordner abgelegt werden.

* Der Output des report-visualizers befindet sich im `public`-Ordner

* Für die Entwicklung kann mit `npm run dev` eine Demo-XML-Datei (siehe: `assets/xml-examples/`) genutzt werden.

* `npm run dev++` baut die Testseite auf basis der aktuell generierten Datei des `divekit-report-mapper`. Voraussetzung
  dabei ist das der `divekit-report-visualizer` im selben Ordner wie der `divekit-report-mapper` liegt.

## Changelog

### 1.0.3
- Namesaktualisierung: von `divekit-new-test-page-generator` zu `divekit-report-visualizer`

### 1.0.2

- Verstecke Metadaten im Header hinzugefügt, welche die Anzahl fehlgeschlagener Tests angibt.
- Möglichkeit hinzugefügt einen speziellen 'NoteTest' Testfall zu übergeben, welcher gesondert angezeigt wird.
- Die Fehlermeldung bei Generierungsproblemen wurde aktualisiert, sodass diese auch angezeigt wird, wenn nur Teile der
  Testseite nicht generiert werden konnten.
- Es wurde ein Fehler behoben, bei welchem die Testseite nicht erzeugt werden konnte, sollte keinerlei input erfolgen.
