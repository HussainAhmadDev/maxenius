import { FC } from 'react';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { languageData } from '@/constants';
import { PDFFormState } from '@/types/PdfProfile';

interface Props {
  data: PDFFormState;
}
const PDFDocument: FC<Props> = ({ data }: Props) => {
  const canvas = document.getElementById('canvasPreview') as HTMLCanvasElement;

  const file = canvas.toDataURL('image/png') as unknown as File;
  const previewImage = data?.image?.url || file;
  const {
    editor: {
      pdf: {
        form: { profile: prof, header, footer },
      },
    },
  } = languageData;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border} />
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={[styles.column, styles.p_5]}>
              <Text style={styles.text}>{prof.material}</Text>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {data.material ?? '---'}
              </Text>
            </View>
            <View style={[styles.column, styles.p_5]}>
              <Text style={styles.text}>{prof.strength}</Text>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {data.stärke ?? '---'}
              </Text>
            </View>
            <View style={[styles.column, styles.p_5]}>
              <Text style={styles.text}>{prof.corrosionProtection}</Text>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {data.korrosionsschutz ?? '---'}
              </Text>
            </View>
            <View style={[styles.column, styles.p_5]}>
              <Text style={styles.text}>{prof.buildingHeight}</Text>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {data.gebHöhe ?? '---'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.column, { height: '530px' }]}>
              <Image src={previewImage} style={{ width: '100%', height: 'auto' }} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text
                style={{ fontSize: '9px', color: 'red', padding: '5px' }}
              >{`Die dauerhaft sturmsichere Befestigung auf einem geeigneten, biegesteifen Untergrund ist bauseits sicherzustellen! Ab einer Blendenhöhe >150mmsind die Halter zusätzlich fassadenseitig mechanisch zu befestigen. Grundsätzlich sind Passlängen, Gehrungsschnitte (z.B. bei einer polygonalen Ausführung),sowie Aufkantungen, Endkappen und andere Formteile bei Bedarf ebenfalls bauseitig anzupassen. Alle Angaben sind bauseits durch unseren Kunden zu prüfen!
Diese Zeichnung inkl. Stücklisten steht im Eigentum der Pohl DWS GmbH. Vervielfältigung und/ oder die Weitergabe an Dritte sind untersagt.Zuwiderhandlungen führen zu Schadenersatzansprüchen.`}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <View style={[styles.column, styles.noBorder]}>
                <View style={styles.table}>
                  <View style={styles.row}>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.name}</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.name ?? '---'}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.date}:</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.datum ?? '---'}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{footer.addendumToAU}:</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.artikelnr ?? '---'}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.auNo}</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.au_nr ?? '---'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.table}>
                  <View style={styles.row}>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.customer}:</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.kunde ?? '---'}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.com}:</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.kom ?? '---'}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{header.sheet}:</Text>
                      <Text
                        style={[styles.text, { textAlign: 'center', minHeight: '20px' }]}
                      >
                        {data.blatt ?? '---'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.table}>
                  <View style={styles.row}>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{footer.contact.pohlDWSGmbH}:</Text>
                      <Text style={[styles.text, { textAlign: 'center' }]}>1</Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>{footer.contact.nickePutz}:</Text>
                      <Text style={[styles.text, { textAlign: 'center' }]}>3</Text>
                    </View>
                    <View style={[styles.column, styles.p_3]}>
                      <Text style={styles.text}>
                        {footer.contact.nickePutz} {footer.contact.duren}:
                      </Text>
                      <Text style={[styles.text, { textAlign: 'center' }]}>2</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.column, styles.p_3, { width: '370px' }]}>
                <Image src="/logo.png" style={{ height: '80px' }} />
              </View>
            </View>
          </View>
        </View>
      </Page>

      {data?.profiles?.map((profile, i) => {
        const profileCanvas = document.getElementById(`profile${i}`) as HTMLCanvasElement;

        const profileCanvasImageURI =
          profile?.image?.url ?? profileCanvas?.toDataURL('image/png');
        // eslint-disable-next-line no-console

        return (
          <Page size="A4" key={profile.id} style={styles.page}>
            <View style={styles.table}>
              <View style={styles.row}>
                <View style={[styles.column, styles.p_5]}>
                  <Text style={styles.text}>{header.material}</Text>
                  <Text style={[styles.text, { textAlign: 'center' }]}>
                    {profile.materialwerkstoff ?? '---'}
                  </Text>
                </View>
                <View style={[styles.column, styles.p_5]}>
                  <Text style={styles.text}>{header.strength}</Text>
                  <Text style={[styles.text, { textAlign: 'center' }]}>
                    {profile.materialstärke ?? '---'}
                  </Text>
                </View>
                <View style={[styles.column, styles.p_5]}>
                  <Text style={styles.text}>{header.corrosionProtection}</Text>
                  <Text style={[styles.text, { textAlign: 'center' }]}>
                    {profile.korrosionsschutz ?? '---'}
                  </Text>
                </View>
                <View style={[styles.column, styles.p_5]}>
                  <Text style={styles.text}>{header.buildingHeight}</Text>
                  <Text style={[styles.text, { textAlign: 'center' }]}>
                    {profile.gebäudehöhe ?? '---'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.noBorder, styles.p_5]}>
                        <Text style={styles.text}>{prof.plastering}:</Text>
                      </View>
                      <View
                        style={[
                          styles.column,
                          styles.noBorder,
                          styles.p_5,
                          styles.checkboxFlex,
                        ]}
                      >
                        <Text style={styles.text}>{prof.no}</Text>
                        <Image
                          src={`/icons/pdf/${profile.nein ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                      <View
                        style={[
                          styles.column,
                          styles.noBorder,
                          styles.p_5,
                          styles.checkboxFlex,
                        ]}
                      >
                        <Text style={styles.text}>A</Text>
                        <Image
                          src={`/icons/pdf/${profile.a ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                      <View
                        style={[
                          styles.column,
                          styles.noBorder,
                          styles.p_5,
                          styles.checkboxFlex,
                        ]}
                      >
                        <Text style={styles.text}>B</Text>
                        <Image
                          src={`/icons/pdf/${profile.b ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                      <View
                        style={[
                          styles.column,
                          styles.noBorder,
                          styles.p_5,
                          styles.checkboxFlex,
                        ]}
                      >
                        <Text style={styles.text}>C</Text>
                        <Image
                          src={`/icons/pdf/${profile.c ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}></Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.type}:</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.piece}</Text>
                      </View>
                      <View style={[styles.column]}>
                        <Text style={{ fontSize: '11px' }}>{prof.damagedByIt}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.holder}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.haltetyp ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>
                          {prof.additionalVerb?.replace('.', '')}:
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.zusverb ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.zus_stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.zus_davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.ae_ha}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.aetyp ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ae_stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ae_davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.ie_ha}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ietyp ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ie_stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ie_davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.gef_u}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.geftyp ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.gef_stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.gef_davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.akLoose}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.aktyp ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ak_stuck ?? '---'}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.ak_davon ?? '---'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.column}>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.column,
                          styles.p_3,
                          styles.noBorder,
                          { height: '128px' },
                        ]}
                      >
                        <Image
                          src={profileCanvasImageURI}
                          style={{ width: '100%', height: 'auto' }}
                        />
                        {/* <Text style={styles.text}></Text> */}
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.gotOver}</Text>
                        <Text style={styles.text}>{profile.uberstand}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.holderDepreciation}</Text>
                        <Text style={styles.text}>{profile.halterabst}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.gradient} (mm)</Text>
                        <Text style={styles.text}>{profile.gefalle}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.gradient} (°)</Text>
                        <Text style={styles.text}>{profile.gefalle1}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <View style={[styles.column, styles.noBorder]}>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.separately}:</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.checkboxFlex]}>
                        <Text style={styles.text}>{prof.yes}</Text>
                        <Image
                          src={`/icons/pdf/${profile.ja ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                      <View style={[styles.column, styles.p_3, styles.checkboxFlex]}>
                        <Text style={styles.text}>{prof.no}</Text>
                        <Image
                          src={`/icons/pdf/${profile.nein2 ? 'checked' : 'uncheck'}.png`}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{prof.area}:</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{profile.bereich ?? '---'}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}></Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={[styles.row, { minHeight: '20px' }]}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}></Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}></Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}></Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.pos}:</Text>
                        <Text style={styles.text}>{profile.getrennt}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{profile?.position}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.until}:</Text>
                        <Text style={styles.text}>{profile?.bis}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>
                          {prof.packTogetherWithAU}: {profile?.zus}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={[styles.column, styles.noBorder]}>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.devi?.replace('.', '')}:</Text>
                        <Text style={styles.text}>{profile.abw}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.runningMeter}</Text>
                        <Text style={styles.text}>{profile.lfm}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>
                          {prof.ae}/{prof.ie}=90
                        </Text>
                        <Text style={styles.text}>{profile.ai_ie}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>
                          {prof.ae}/{prof.ie}=90
                        </Text>
                        <Text style={styles.text}>{profile.ai_ie1}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>
                          {prof.gt}/{prof.te}=90
                        </Text>
                        <Text style={styles.text}>{profile.ge_te}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>
                          {prof.gt}/{prof.te}=90
                        </Text>
                        <Text style={styles.text}>{profile.ge_te1}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.ak}</Text>
                        <Text style={styles.text}>{profile.ak}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.ek}</Text>
                        <Text style={styles.text}>{profile.ek}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.offsetSt}</Text>
                        <Text style={styles.text}>{profile.versatz}</Text>
                      </View>
                      <View style={[styles.column, styles.p_3, styles.flex]}>
                        <Text style={styles.text}>{prof.specialMoldedParts}</Text>
                        <Text style={styles.text}>{profile.sonder}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={[styles.row, { height: '100px' }]}>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}></Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <View style={[styles.column, styles.p_3, { width: '250px' }]}>
                  <Text style={styles.text}>{prof.verp}</Text>
                </View>
                <View style={[styles.column, styles.p_3, styles.flex]}>
                  <Text style={styles.text}>{prof.posNoGrave}</Text>
                  <Image
                    src={`/icons/pdf/${profile.pos_nr_grave ? 'checked' : 'uncheck'}.png`}
                    style={{ width: '15px', height: '15px' }}
                  />
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{prof.whatFilzst}.</Text>
                </View>
                <View style={[styles.column, styles.p_3, styles.noBorder]}>
                  <Text style={styles.text}></Text>
                </View>

                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>
                    {prof.s}={prof.schere}
                  </Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>
                    {prof.t}={prof.trumpF}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <View style={[styles.column, styles.p_3, { width: '360px' }]}></View>
                <View style={[styles.column, styles.p_3, { width: '350px' }]}>
                  <Text style={styles.text}>{prof.pos}</Text>
                </View>
                <View style={[styles.column, styles.p_3, { width: '350px' }]}>
                  <Text style={styles.text}>{prof.piece}.</Text>
                </View>
                <View style={[styles.column, styles.p_3, { width: '350px' }]}>
                  <Text style={styles.text}>{prof.ref}</Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{`<`}</Text>
                </View>

                <View style={[styles.column, styles.p_3, { width: '700px' }]}>
                  <Text style={styles.text}>{prof.lMabe}</Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{prof.finalLeft}</Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{prof.finalRight}</Text>
                </View>
                <View
                  style={[styles.column, styles.p_3, styles.flex, { width: '800px' }]}
                >
                  <Text style={styles.text}>{prof.cutting}</Text>
                  <Image
                    src={`/icons/pdf/${profile.zuschnitt ? 'checked' : 'uncheck'}.png`}
                    style={{ width: '15px', height: '15px' }}
                  />
                  <Text style={styles.text}>{prof.t}.:</Text>
                  <Image
                    src={`/icons/pdf/${profile.t ? 'checked' : 'uncheck'}.png`}
                    style={{ width: '15px', height: '15px' }}
                  />
                </View>
              </View>
            </View>
            {profile?.pieces_data?.map((piece) => (
              <View style={styles.table} key={piece.id}>
                <View style={[styles.row, { minHeight: '20px' }]}>
                  <View style={[styles.column, styles.p_3, { width: '360px' }]}></View>
                  <View style={[styles.column, styles.p_3]}>
                    <Text style={styles.text}>{piece.pos}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3]}>
                    <Text style={styles.text}>{piece.amount}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3, { width: '350px' }]}>
                    <Text style={styles.text}>{piece.bezeichung}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3, { width: '350px' }]}>
                    <Text style={styles.text}>{piece?.angle}</Text>
                  </View>

                  <View style={[styles.column, styles.p_3, { width: '700px' }]}>
                    <Text style={styles.text}>{piece?.length}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3]}>
                    <Text style={styles.text}>{piece?.beze}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3]}>
                    <Text style={styles.text}>{piece?.chung}</Text>
                  </View>
                  <View style={[styles.column, styles.p_3, { width: '800px' }]}>
                    <Text style={styles.text}>{piece.zuschnitt}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.table}>
              <View style={[styles.row, { minHeight: '20px' }]}>
                <View style={[styles.column, styles.p_3, { width: '60%' }]}>
                  <Text style={styles.text}>{prof.friemsnGemban}</Text>
                  <Text style={styles.text}>DIN EN ISO 2768</Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{header.sheetMetalBaseMaterial}</Text>
                  <Text style={styles.text}>{header.baseMaterialHolder}</Text>
                </View>
                <View style={[styles.column, styles.p_3]}>
                  <Text style={styles.text}>{header.productText}</Text>
                </View>
                <View style={[styles.column, styles.noBorder]}>
                  <View style={styles.table}>
                    <View style={[styles.row]}>
                      <View style={[styles.column, styles.noBorder]}>
                        <View style={styles.table}>
                          <View style={styles.row}>
                            <View style={[styles.column]}>
                              <Text style={styles.text}>{header.change}</Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}>{header.date}</Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}>{header.name}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.table}>
                          <View style={[styles.row, { minHeight: '20px' }]}>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.table}>
                          <View style={[styles.row, { minHeight: '20px' }]}>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                            <View style={[styles.column]}>
                              <Text style={styles.text}></Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.column, styles.p_3, { width: '80px' }]}>
                        <Text style={styles.text}>{header.scale} --- </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <View style={[styles.column, styles.noBorder]}>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.name}</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.name}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.date}:</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.date}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{footer.addendumToAU}:</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.nachtrag}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.auNo}</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {profile.au_nr}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.customer}:</Text>
                        <Text
                          style={[
                            styles.text,
                            { textAlign: 'center', minHeight: '10px' },
                          ]}
                        >
                          {profile.kunde}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.com?.replace('.', '')}:</Text>
                        <Text
                          style={[
                            styles.text,
                            { textAlign: 'center', minHeight: '10px' },
                          ]}
                        >
                          {profile.kom}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{header.sheet}:</Text>
                        <Text
                          style={[
                            styles.text,
                            { textAlign: 'center', minHeight: '10px' },
                          ]}
                        >
                          {profile.blatt}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.table}>
                    <View style={styles.row}>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{footer.contact.pohlDWSGmbH}:</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          {footer.contact.werkDuren}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>{footer.contact.nickePutz}:</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          Tel: {footer.contact.tel}
                        </Text>
                      </View>
                      <View style={[styles.column, styles.p_3]}>
                        <Text style={styles.text}>
                          {footer.contact.code} {footer.contact.duren}:
                        </Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>
                          Fax: {footer.contact.fax}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[styles.column, styles.p_3, { width: '370px' }]}>
                  <Image src="/logo.png" style={{ height: '80px' }} />
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  border: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'green',
  },
  table: {
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  noBorder: {
    borderWidth: 0,
    borderColor: 'none',
  },
  text: {
    fontSize: '10px',
  },
  p_3: {
    padding: 3,
  },
  p_5: {
    padding: 5,
  },
  column: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    // padding: 5,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5px',
  },
});

export default PDFDocument;
